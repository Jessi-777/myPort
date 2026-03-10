const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId } = req.body; // ✅ match what frontend sends

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create Checkout Session
// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { cartItems } = req.body;

//     const line_items = cartItems.map(item => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.name,
//           images: [item.image],
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// });

// module.exports = router;



// import express from "express";
// import Stripe from "stripe";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Create Checkout Session
// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { cartItems } = req.body; // from frontend

//     const line_items = cartItems.map(item => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.name,
//           images: [item.image],
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// });

// export default router;
