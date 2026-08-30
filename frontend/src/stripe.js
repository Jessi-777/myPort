const API = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

export const handleCheckout = async (priceId) => {
  if (!priceId) {
    throw new Error(
      "Missing Stripe Price ID."
    );
  }

  if (
    typeof priceId !== "string" ||
    !priceId.startsWith("price_")
  ) {
    throw new Error(
      `Invalid Stripe Price ID: ${priceId}`
    );
  }

  if (!API) {
    throw new Error(
      "VITE_API_URL is not configured."
    );
  }

  const response = await fetch(
    `${API}/api/checkout`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        priceId,
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Checkout failed (${response.status}).`
    );
  }

  if (!data?.url) {
    throw new Error(
      "Stripe checkout session was created, but no checkout URL was returned."
    );
  }

  window.location.assign(data.url);
};


export const handlePhysicalCheckout = async (
  productId,
  variantId = null,
  quantity = 1
) => {
  if (!productId) {
    throw new Error(
      "Missing physical product ID."
    );
  }

  if (!API) {
    throw new Error(
      "VITE_API_URL is not configured."
    );
  }

  const response = await fetch(
    `${API}/api/checkout/printify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        items: [
          {
            productId,
            variantId,
            quantity,
          },
        ],
      }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Physical checkout failed (${response.status}).`
    );
  }

  if (!data?.url) {
    throw new Error(
      "Physical checkout session was created, but no checkout URL was returned."
    );
  }

  window.location.assign(data.url);
};



// import { loadStripe } from "@stripe/stripe-js";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;
// const pk = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// if (!API) {
//   console.error("❌ VITE_API_URL is missing");
// }

// if (!pk) {
//   console.error("❌ VITE_STRIPE_PUBLIC_KEY is missing");
// }

// const stripePromise = pk ? loadStripe(pk) : null;

// /*
// |--------------------------------------------------------------------------
// | DIGITAL CHECKOUT
// |--------------------------------------------------------------------------
// */
// export const handleCheckout = async (priceId) => {
//   try {
//     if (!API) {
//       throw new Error("VITE_API_URL is not configured");
//     }

//     if (!priceId) {
//       throw new Error("Product does not have a Stripe Price ID");
//     }

//     if (!priceId.startsWith("price_")) {
//       throw new Error(
//         `Invalid Stripe Price ID: ${priceId}`
//       );
//     }

//     /*
//      * Stripe.js is initialized here intentionally.
//      * The actual redirect is handled by our backend-created
//      * Checkout Session.
//      */
//     if (stripePromise) {
//       await stripePromise;
//     }

//     console.log("🛒 Starting digital checkout:", priceId);

//     const { data } = await axios.post(
//       `${API}/api/checkout`,
//       {
//         priceId,
//       }
//     );

//     if (!data?.url) {
//       throw new Error(
//         "Stripe did not return a checkout URL"
//       );
//     }

//     console.log(
//       "✅ Redirecting to Stripe Checkout:",
//       data.sessionId
//     );

//     window.location.href = data.url;

//   } catch (error) {
//     console.error(
//       "❌ Digital checkout failed:",
//       error?.response?.data || error.message
//     );

//     throw error;
//   }
// };

// /*
// |--------------------------------------------------------------------------
// | PHYSICAL CHECKOUT
// |--------------------------------------------------------------------------
// */
// export const handlePhysicalCheckout = async (
//   productId,
//   variantId = null,
//   quantity = 1
// ) => {
//   try {
//     if (!API) {
//       throw new Error("VITE_API_URL is not configured");
//     }

//     if (!productId) {
//       throw new Error("Missing product ID");
//     }

//     console.log(
//       "🛍️ Starting physical checkout:",
//       productId
//     );

//     const { data } = await axios.post(
//       `${API}/api/checkout/printify`,
//       {
//         items: [
//           {
//             productId,
//             variantId,
//             quantity,
//           },
//         ],
//       }
//     );

//     if (!data?.url) {
//       throw new Error(
//         "Stripe did not return a checkout URL"
//       );
//     }

//     console.log(
//       "✅ Redirecting to Stripe Checkout:",
//       data.sessionId
//     );

//     window.location.href = data.url;

//   } catch (error) {
//     console.error(
//       "❌ Physical checkout failed:",
//       error?.response?.data || error.message
//     );

//     throw error;
//   }
// };