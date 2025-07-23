// src/stripe.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // secure your key in .env

export async function handleCheckout(productId) {
  const stripe = await stripePromise;

  // Call your backend to create the Checkout Session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });

  const session = await response.json();

  // Redirect to Stripe Checkout
  await stripe.redirectToCheckout({ sessionId: session.id });
}
