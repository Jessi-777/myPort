// backend/routes/checkout.js (CommonJS)
const express = require("express");
const Stripe = require("stripe");

const router = express.Router();

// Stripe server SDK with SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// POST /api/checkout
router.post("/", async (req, res) => {
  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;




// // routes/checkout.js
// const express = require('express');
// const router = express.Router();
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// // Check that Stripe secret key exists
// if (!process.env.STRIPE_SECRET_KEY) {
//   console.error('');
//   process.exit(1); // Stop the app if key is missing
// }

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// router.post('/', async (req, res) => {
//   const { priceId } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{ price: priceId, quantity: 1 }],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error('❌ Stripe error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// router.post('/', async (req, res) => {
//   const { priceId } = req.body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price: priceId,
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: 'https://yourdomain.com/success',
//       cancel_url: 'https://yourdomain.com/cancel',
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
