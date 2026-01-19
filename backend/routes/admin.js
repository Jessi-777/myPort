const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const { getPresignedPutUrl } = require("../utils/presignUpload");

const router = express.Router();

/* ---------------------------------------
   ADMIN LOGIN (Single Password → JWT)
---------------------------------------- */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  // Get the admin password from env, trim any whitespace
  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  const inputPassword = (password || "").trim();

  // Debug logging
  console.log("Login attempt with password:", inputPassword);
  console.log("Expected password:", adminPassword);
  console.log("Match:", inputPassword === adminPassword);

  // Simple string comparison (after trimming)
  const valid = inputPassword === adminPassword;

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // create JWT
  const token = jwt.sign(
    { sub: "admin", role: "admin" },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "12h" }
  );

  console.log("✓ Admin login successful");
  return res.json({ token });
});

/* ---------------------------------------
   PRESIGNED URL FOR S3 UPLOADS
---------------------------------------- */
router.post("/uploads/presign", adminAuth, async (req, res) => {
  try {
    const { key, contentType } = req.body;

    if (!key || !contentType) {
      return res.status(400).json({ error: "Missing key or contentType" });
    }

    const url = await getPresignedPutUrl({ key, contentType });

    return res.json({ url, key });
  } catch (err) {
    console.error("Presign error:", err);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/* ---------------------------------------
   GET ALL PRODUCTS (Admin dashboard)
---------------------------------------- */
router.get("/products", adminAuth, async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ products });
  } catch (err) {
    console.error("Fetch admin products error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ---------------------------------------
   CREATE PRODUCT
---------------------------------------- */
router.post("/products", adminAuth, async (req, res) => {
  try {
    const { title, description, priceId, imageUrl, fileKey, visible } = req.body;

    if (!title || !priceId || !fileKey) {
      return res.status(400).json({
        error: "Missing required fields: title, priceId, fileKey",
      });
    }

    const product = await Product.create({
      title,
      description,
      priceId,
      imageUrl,
      fileKey,
      visible,
    });

    return res.json({ product });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ error: "Failed to create product" });
  }
});

/* ---------------------------------------
   UPDATE PRODUCT
---------------------------------------- */
router.put("/products/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ error: "Failed to update product" });
  }
});

/* ---------------------------------------
   DELETE PRODUCT
---------------------------------------- */
router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
