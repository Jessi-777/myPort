import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Ensure env is present; helps catch mistakes early
const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!pk) {
  // Optional: more visible error during dev
  console.error("Missing VITE_STRIPE_PUBLIC_KEY in frontend/.env");
}

const stripePromise = loadStripe(pk);

export const handleCheckout = async (priceId) => {
  try {
    const stripe = await stripePromise; // keep this so Stripe.js is initialized

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/checkout`,
      { priceId }
    );

    // Redirect to the Stripe-hosted checkout
    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout error:", error?.response?.data || error.message);
    alert("Store opening soon. Please check back later.");
  }
};
