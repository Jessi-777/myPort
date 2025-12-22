// routes/productsPublic.js
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// GET public products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ visible: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Public product fetch error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;
