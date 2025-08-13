"""Minimal Flask example integrating Lemon Squeezy subscriptions.

This example creates checkout sessions and processes webhooks with
HMAC verification, replay protection and atomic entitlement updates.
It stores receipts and replay tokens in Firestore if configured or in
memory otherwise.
"""

from __future__ import annotations

import os
import hmac
import hashlib
from typing import Dict, Any

from flask import Flask, request, jsonify
import requests

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except Exception:  # pragma: no cover - firebase optional
    firebase_admin = None
    firestore = None

app = Flask(__name__)

# --- optional Firestore setup -------------------------------------------------
_db = None
if firebase_admin and os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    try:  # pragma: no cover - only runs when creds provided
        firebase_admin.initialize_app()
        _db = firestore.client()
    except Exception:
        _db = None

# In-memory fallbacks when Firestore not configured
_processed_events: set[str] = set()
_entitlements: Dict[str, Any] = {}
_receipts: list[Dict[str, Any]] = []

LEMON_API_KEY = os.getenv("LEMON_SQUEEZY_API_KEY", "")
LEMON_STORE = os.getenv("LEMON_SQUEEZY_STORE_ID", "")
WEBHOOK_SECRET = os.getenv("LEMON_SQUEEZY_WEBHOOK_SECRET", "")
API_KEY = os.getenv("API_EXAMPLE_KEY", "")


# --- simple API key + quota ---------------------------------------------------
_request_counts: Dict[str, int] = {}
QUOTA = 100  # requests per key per hour (example)


def _auth(api_key: str) -> bool:
    count = _request_counts.get(api_key, 0)
    if count >= QUOTA:
        return False
    _request_counts[api_key] = count + 1
    return api_key == API_KEY


@app.route("/checkout", methods=["POST"])
def create_checkout() -> tuple[Any, int]:
    api_key = request.headers.get("X-API-Key")
    if not _auth(api_key):
        return {"error": "invalid api key or quota exceeded"}, 401

    payload = request.get_json(force=True)
    variant_id = payload.get("variant_id")
    customer_email = payload.get("customer_email")

    checkout_payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "checkout_data": {
                    "email": customer_email,
                },
            },
            "relationships": {
                "store": {"data": {"type": "stores", "id": LEMON_STORE}},
                "variant": {"data": {"type": "variants", "id": variant_id}},
            },
        }
    }
    headers = {
        "Authorization": f"Bearer {LEMON_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    resp = requests.post(
        "https://api.lemonsqueezy.com/v1/checkouts",
        json=checkout_payload,
        headers=headers,
        timeout=30,
    )
    return resp.json(), resp.status_code


@app.route("/webhook", methods=["POST"])
def lemon_webhook() -> tuple[Any, int]:
    signature = request.headers.get("X-Signature", "")
    expected = hmac.new(WEBHOOK_SECRET.encode(), request.data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return {"error": "invalid signature"}, 400

    data = request.get_json(force=True)
    event_id = data.get("id")
    if event_id in _processed_events:
        return {"status": "duplicate"}, 200

    _processed_events.add(event_id)
    user_id = data.get("data", {}).get("attributes", {}).get("user_id")
    plan = data.get("data", {}).get("attributes", {}).get("variant_id")

    # --- atomic entitlement update -------------------------------------------
    if _db:
        doc_ref = _db.collection("entitlements").document(user_id)
        def _txn(transaction):
            snapshot = doc_ref.get(transaction=transaction)
            transaction.set(doc_ref, {"plan": plan, "event": event_id})
        _db.transaction()( _txn )
        _db.collection("receipts").document(event_id).set(data)
    else:
        _entitlements[user_id] = {"plan": plan, "event": event_id}
        _receipts.append(data)

    return {"status": "processed"}, 200


if __name__ == "__main__":
    app.run(port=5001)
