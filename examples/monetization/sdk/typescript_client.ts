import fetch from 'node-fetch';

const API_KEY = process.env.API_EXAMPLE_KEY || 'test_abc123';
const BASE_URL = process.env.EXAMPLE_BASE_URL || 'http://localhost:5001';

async function createCheckout(variantId: string, customerEmail: string) {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ variant_id: variantId, customer_email: customerEmail }),
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

createCheckout('123', 'user@example.com').then(console.log).catch(console.error);
