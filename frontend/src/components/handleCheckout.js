export const handleCheckout = async (priceId) => {
  try {
    if (!priceId) {
      throw new Error(
        "This digital product does not have a Stripe Price ID."
      );
    }

    const API = import.meta.env.VITE_API_URL?.replace(
      /\/$/,
      ""
    );

    const res = await fetch(
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.error ||
          "Failed to start checkout."
      );
    }

    if (!data?.url) {
      throw new Error(
        "Stripe did not return a checkout URL."
      );
    }

    window.location.href =
      data.url;
  } catch (error) {
    console.error(
      "Checkout error:",
      error
    );

    alert(
      error.message ||
        "Failed to start checkout."
    );
  }
};