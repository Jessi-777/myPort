// backend/routes/checkout.js (CommonJS)
const express = require("express");
const Stripe = require("stripe");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

// Stripe server SDK with SECRET key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/**
 * POST /api/checkout
 * Create checkout session for digital products (using priceId)
 */
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

/**
 * POST /api/checkout/printify
 * Create checkout session for physical products (Printify)
 * Body: { items: [{productId, variantId, quantity}] }
 */
router.post("/printify", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // Fetch product details from DB
    const lineItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.productType !== "physical") {
        return res.status(400).json({ error: "Invalid product type" });
      }

      // Use product price or variant price if available
      const price = product.price;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.description,
            images: product.imageUrl ? [product.imageUrl] : [],
          },
          unit_amount: Math.round(price),
        },
        quantity: item.quantity || 1,
      });

      totalPrice += price * (item.quantity || 1);
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      // Store cart items for order creation later
      metadata: {
        cartItems: JSON.stringify(items),
      },
    });

    // Create Order record in DB (status: pending)
    const order = await Order.create({
      stripeSessionId: session.id,
      items: items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity || 1,
      })),
      status: "pending",
    });

    return res.json({ 
      url: session.url,
      orderId: order._id,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("❌ Stripe/Printify error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * GET /api/checkout/session/:sessionId
 * Get checkout session details
 */
router.get("/session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (err) {
    console.error("❌ Session retrieval error:", err);
    return res.status(500).json({ error: "Failed to retrieve session" });
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
