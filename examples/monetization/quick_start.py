"""Quick start script demonstrating end-to-end flow.

1. Creates a checkout session.
2. Simulates a webhook payload.
"""

import json
import os
import hmac
import hashlib
import requests

API_KEY = os.getenv("API_EXAMPLE_KEY", "test_abc123")
BASE_URL = os.getenv("EXAMPLE_BASE_URL", "http://localhost:5001")
WEBHOOK_SECRET = os.getenv("LEMON_SQUEEZY_WEBHOOK_SECRET", "whsec_123")

# Step 1: create checkout session
checkout = requests.post(
    f"{BASE_URL}/checkout",
    json={"variant_id": "123", "customer_email": "user@example.com"},
    headers={"X-API-Key": API_KEY},
    timeout=10,
).json()
print("Checkout response:", checkout)

# Step 2: simulate webhook
event = {"id": "evt_1", "data": {"attributes": {"user_id": "user-1", "variant_id": "123"}}}
raw = json.dumps(event).encode()
signature = hmac.new(WEBHOOK_SECRET.encode(), raw, hashlib.sha256).hexdigest()
resp = requests.post(f"{BASE_URL}/webhook", data=raw, headers={"X-Signature": signature})
print("Webhook response:", resp.json())
