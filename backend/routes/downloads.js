const express = require("express");
const router = express.Router();

const Stripe = require("stripe");
let stripe;
function getStripe() {
  if (!stripe) {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

const Product = require("../models/Product");

router.get("/", async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(403).json({ error: "Payment not completed" });
    }

    const productId = session.metadata?.productId;

    if (!productId) {
      return res.json({ items: [] });
    }

    const product = await Product.findById(productId);

    if (!product || !product.fileKey) {
      return res.json({ items: [] });
    }

    return res.json({
      items: [
        {
          name: product.title,
          url: product.fileKey,
        },
      ],
    });
  } catch (err) {
    console.error("❌ Downloads error:", err);
    res.status(400).json({ error: "Invalid session" });
  }
});

module.exports = router;
