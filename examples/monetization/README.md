# Monetization & API Example

This directory contains a minimal reference implementation for subscription-based monetization using [Lemon Squeezy](https://www.lemonsqueezy.com/). It demonstrates:

- Checkout session creation with tax/VAT handled by Lemon Squeezy.
- Webhook processing with HMAC verification and replay protection.
- Atomic entitlement updates stored in Firestore.
- OpenAPI 3 specification with Swagger UI and a Postman collection.
- Simple API key enforcement and per-key request quotas.
- Lightweight TypeScript and Python SDK examples.
- A quick-start script that exercises the API in under five minutes.

The example code is self-contained and uses environment variables so it can be easily configured to work with a real Lemon Squeezy store.

## Prerequisites

1. A Lemon Squeezy store and API key.
2. A Firestore project (for entitlements and webhook replay protection).
3. Python 3.10+ and Node.js 18+.

## Environment Variables

Create a `.env` file with the following values:

```bash
LEMON_SQUEEZY_API_KEY="sk_123"       # Lemon Squeezy API key
LEMON_SQUEEZY_STORE_ID="12345"       # Store ID
LEMON_SQUEEZY_WEBHOOK_SECRET="whsec_123"  # Webhook signing secret
API_EXAMPLE_KEY="test_abc123"        # API key used by the SDK examples
```

## Running the Example Server

```bash
pip install -r requirements.txt
python lemonsqueezy_flask_example.py
```

The server exposes two endpoints:

- `POST /checkout` – creates a checkout session.
- `POST /webhook` – handles webhook events.

Both endpoints are described in [`openapi.yaml`](./openapi.yaml). Open the file in a Swagger UI viewer (e.g., [editor.swagger.io](https://editor.swagger.io/)). A Postman collection is provided in [`postman_collection.json`](./postman_collection.json).

## SDK Usage

TypeScript and Python clients are available in [`sdk/`](./sdk/). Set `API_EXAMPLE_KEY` and run:

```bash
# Python
python sdk/python_client.py

# TypeScript
node sdk/typescript_client.ts
```

Each client makes a request to the example server using an API key and prints the response.

## Quick Start

The script [`quick_start.py`](./quick_start.py) demonstrates how a buyer can create a checkout session and simulate a webhook in under five minutes.

---

This example is not production-ready but provides a clear starting point for integrating subscriptions, webhooks and API productisation.
