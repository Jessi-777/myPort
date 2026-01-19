// backend/routes/adminProducts.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");

// Apply admin auth to all routes
router.use(adminAuth);

/**
 * GET /api/admin/products
 * Get all products (admin view)
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * POST /api/admin/products
 * Create a new product (digital or physical)
 * 
 * For Digital:
 * {
 *   title, description, productType: "digital",
 *   price, imageUrl, priceId, fileKey
 * }
 * 
 * For Physical (Original):
 * {
 *   title, description, productType: "physical",
 *   price, imageUrl
 * }
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      productType,
      price,
      imageUrl,
      priceId,
      fileKey,
      visible,
      category,
      tags,
    } = req.body;

    // Validation
    if (!title || !productType || !price) {
      return res.status(400).json({
        error: "Missing required fields: title, productType, price",
      });
    }

    if (!["digital", "physical"].includes(productType)) {
      return res.status(400).json({
        error: "productType must be 'digital' or 'physical'",
      });
    }

    // For digital products, fileKey is required
    if (productType === "digital" && !fileKey && !priceId) {
      return res.status(400).json({
        error: "Digital products need either fileKey (S3) or priceId (Stripe)",
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      productType,
      price: Math.round(price * 100), // Convert to cents
      imageUrl,
      priceId: priceId || null,
      fileKey: fileKey || null,
      visible: visible !== false,
      category: category || null,
      tags: tags || [],
    });

    res.status(201).json({
      message: "✓ Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

/**
 * PUT /api/admin/products/:id
 * Update a product
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow changing productType
    delete updates.productType;

    // Convert price if provided
    if (updates.price) {
      updates.price = Math.round(updates.price * 100);
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "✓ Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/**
 * PATCH /api/admin/products/:id/toggle-visibility
 * Toggle product visibility
 */
router.patch("/:id/toggle-visibility", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.visible = !product.visible;
    await product.save();

    res.json({
      message: `✓ Product ${product.visible ? "shown" : "hidden"}`,
      visible: product.visible,
    });
  } catch (error) {
    console.error("Error toggling visibility:", error);
    res.status(500).json({ error: "Failed to toggle visibility" });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "✓ Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

/**
 * GET /api/admin/products/stats
 * Get product statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const digital = await Product.countDocuments({ productType: "digital" });
    const physical = await Product.countDocuments({ productType: "physical" });
    const visible = await Product.countDocuments({ visible: true });

    res.json({
      total,
      digital,
      physical,
      visible,
      hidden: total - visible,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

module.exports = router;
