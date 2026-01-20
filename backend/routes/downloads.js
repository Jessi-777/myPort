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
const generateSignedUrl = require("../utils/s3");

router.get("/", async (req, res) => {
  const sessionId = req.query.session_id;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    const lineItems = await getStripe().checkout.sessions.listLineItems(sessionId);

    const priceToFile = {
      "price_fullmoon": "fullmoon.zip",
      "price_uiuxpack": "uiux_pack.zip",
      "price_peacemixtape": "peace_mixtape.zip",
    };

    const items = [];
    for (const item of lineItems.data) {
      const priceId = item.price.id;
      const key = priceToFile[priceId];
      if (key) {
        const url = await generateSignedUrl(key);
        items.push({ name: item.description, url });
      }
    }

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid session" });
  }
});

module.exports = router;
