// backend/routes/printify.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const { getShops, getProducts, getProduct, createOrder } = require("../utils/printify");

/**
 * GET /api/printify/shops
 * Get all Printify shops
 */
router.get("/shops", async (req, res) => {
  try {
    const shops = await getShops();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

/**
 * POST /api/printify/sync-products
 * Sync products from Printify to MongoDB
 * Body: { shopId }
 */
router.post("/sync-products", async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ error: "shopId is required" });
    }

    // Fetch products from Printify
    const printifyProducts = await getProducts(shopId);

    // Sync each product to MongoDB
    for (const printifyProduct of printifyProducts.data) {
      const existingProduct = await Product.findOne({
        printifyProductId: printifyProduct.id,
        printifyShopId: shopId,
      });

      const productData = {
        title: printifyProduct.title,
        description: printifyProduct.description || "",
        printifyProductId: printifyProduct.id,
        printifyShopId: shopId,
        productType: "physical",
        price: printifyProduct.variants[0]?.price || 0, // Get price from first variant
        imageUrl: printifyProduct.images[0]?.src || "",
        visible: true,
        printifyData: {
          variants: printifyProduct.variants.map(v => ({
            variantId: v.id,
            title: v.title,
            price: v.price,
            available: v.available,
          })),
          images: printifyProduct.images,
        },
      };

      if (existingProduct) {
        // Update existing
        await Product.updateOne(
          { _id: existingProduct._id },
          productData
        );
      } else {
        // Create new
        await Product.create(productData);
      }
    }

    res.json({
      message: `✓ Synced ${printifyProducts.data.length} products from Printify`,
      count: printifyProducts.data.length,
    });
  } catch (error) {
    console.error("Printify sync error:", error);
    res.status(500).json({ error: "Failed to sync products" });
  }
});

/**
 * GET /api/printify/products
 * Get all physical products (Printify synced)
 */
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({
      productType: "physical",
      visible: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * GET /api/printify/products/:productId
 * Get single product details
 */
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;
