export const handleCheckout = async (priceId) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/checkout/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Failed to start checkout");
  }
};


// export const handleCheckout = async (priceId) => {
//   const res = await fetch('/api/checkout', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ priceId }),
//   });

//   const data = await res.json();
//   window.location.href = data.url;
// };
