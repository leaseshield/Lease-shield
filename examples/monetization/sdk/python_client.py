"""Simple Python SDK example for the monetization API."""

import os
import requests

API_KEY = os.getenv("API_EXAMPLE_KEY", "test_abc123")
BASE_URL = os.getenv("EXAMPLE_BASE_URL", "http://localhost:5001")


def create_checkout(variant_id: str, customer_email: str):
    payload = {"variant_id": variant_id, "customer_email": customer_email}
    resp = requests.post(
        f"{BASE_URL}/checkout",
        json=payload,
        headers={"X-API-Key": API_KEY},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


if __name__ == "__main__":
    print(create_checkout("123", "user@example.com"))
