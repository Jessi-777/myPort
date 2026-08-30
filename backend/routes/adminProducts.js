const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");

// Apply admin authentication to every route.
router.use(adminAuth);

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| PRICE
|--------------------------------------------------------------------------
|
| ADMIN PRICE CONTRACT:
|
| The Admin Product Manager sends the price as DOLLARS.
|
| Example:
|
| Admin enters: 25
| API receives: 25
| MongoDB stores: 2500
|
| Admin enters: 19.99
| API receives: 19.99
| MongoDB stores: 1999
|
| Admin enters: 0
| API receives: 0
| MongoDB stores: 0
|
| MongoDB ALWAYS stores cents.
|
|--------------------------------------------------------------------------
*/

const normalizePriceToCents = (price) => {
  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return null;
  }

  const numericPrice = Number(price);

  if (
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    return null;
  }

  return Math.round(numericPrice * 100);
};

/*
|--------------------------------------------------------------------------
| GET /api/admin/products
| Get all products
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);

    return res.status(500).json({
      error: "Failed to fetch products",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/admin/products/stats
| Product statistics
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This route must appear before /:id.
|
|--------------------------------------------------------------------------
*/

router.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();

    const digital = await Product.countDocuments({
      productType: "digital",
    });

    const physical = await Product.countDocuments({
      productType: "physical",
    });

    const visible = await Product.countDocuments({
      visible: true,
    });

    return res.json({
      total,
      digital,
      physical,
      visible,
      hidden: total - visible,
    });
  } catch (error) {
    console.error("❌ Error getting product stats:", error);

    return res.status(500).json({
      error: "Failed to get product statistics",
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/admin/products
| Create product
|--------------------------------------------------------------------------
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
      isFree,
    } = req.body;

    console.log("🎯 CREATE PRODUCT");
    console.log(JSON.stringify(req.body, null, 2));

    /*
    |--------------------------------------------------------------------------
    | Required fields
    |--------------------------------------------------------------------------
    */

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        error: "Product title is required",
      });
    }

    if (!productType) {
      return res.status(400).json({
        error: "Product type is required",
      });
    }

    if (!["digital", "physical"].includes(productType)) {
      return res.status(400).json({
        error: "productType must be 'digital' or 'physical'",
      });
    }

    if (!category || !String(category).trim()) {
      return res.status(400).json({
        error: "Category is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PRICE
    |--------------------------------------------------------------------------
    |
    | Admin sends DOLLARS.
    |
    | $25.00 -> 2500 cents
    | $19.99 -> 1999 cents
    | $2.05  -> 205 cents
    | $0.00  -> 0 cents
    |
    |--------------------------------------------------------------------------
    */

    const priceInCents = normalizePriceToCents(price);

    if (priceInCents === null) {
      return res.status(400).json({
        error: "Please provide a valid product price",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Free products
    |--------------------------------------------------------------------------
    */

    const productIsFree = Boolean(isFree);

    /*
    |--------------------------------------------------------------------------
    | Digital validation
    |--------------------------------------------------------------------------
    |
    | A digital product may have:
    |
    | - fileKey
    | - priceId
    | - both
    |
    | Free digital products do not require Stripe.
    |
    */

    if (
      productType === "digital" &&
      !productIsFree &&
      !fileKey &&
      !priceId
    ) {
      return res.status(400).json({
        error:
          "Paid digital products require a digital file or Stripe Price ID.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create product
    |--------------------------------------------------------------------------
    */

    const newProduct = await Product.create({
      title: String(title).trim(),

      description: description
        ? String(description).trim()
        : "",

      productType,

      // STORE CENTS IN MONGODB
      price: priceInCents,

      imageUrl: imageUrl
        ? String(imageUrl).trim()
        : "",

      priceId: priceId
        ? String(priceId).trim()
        : null,

      fileKey: fileKey
        ? String(fileKey).trim()
        : null,

      visible: visible !== false,

      category: String(category).trim(),

      tags: normalizeTags(tags),

      isFree: productIsFree,

      /*
       * Preserve Printify information if supplied.
       */
      printifyProductId:
        req.body.printifyProductId || null,

      printifyShopId:
        req.body.printifyShopId || null,

      printifyData:
        req.body.printifyData || undefined,
    });

    console.log("✅ PRODUCT CREATED");
    console.log("ID:", newProduct._id);
    console.log("Title:", newProduct.title);
    console.log("Type:", newProduct.productType);
    console.log("Price stored in cents:", newProduct.price);
    console.log(
      "Price displayed in dollars:",
      (newProduct.price / 100).toFixed(2)
    );
    console.log("Free:", newProduct.isFree);

    return res.status(201).json({
      message: "✓ Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Failed to create product",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PUT /api/admin/products/:id
| Update product
|--------------------------------------------------------------------------
*/

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      imageUrl,
      priceId,
      fileKey,
      visible,
      category,
      tags,
      isFree,
    } = req.body;

    console.log("🎯 UPDATE PRODUCT:", id);
    console.log("Incoming price:", price);

    const existingProduct =
      await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Build safe update object
    |--------------------------------------------------------------------------
    */

    const updates = {};

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          error: "Product title is required",
        });
      }

      updates.title = String(title).trim();
    }

    if (description !== undefined) {
      updates.description =
        String(description).trim();
    }

    /*
    |--------------------------------------------------------------------------
    | PRICE UPDATE
    |--------------------------------------------------------------------------
    |
    | Admin sends DOLLARS.
    |
    | $25.00 -> 2500 cents
    | $19.99 -> 1999 cents
    |
    | This conversion happens EXACTLY ONCE.
    |
    |--------------------------------------------------------------------------
    */

    if (price !== undefined) {
      const priceInCents =
        normalizePriceToCents(price);

      if (priceInCents === null) {
        return res.status(400).json({
          error: "Please provide a valid product price",
        });
      }

      updates.price = priceInCents;

      console.log(
        "💰 Price:",
        price,
        "dollars →",
        priceInCents,
        "cents"
      );
    }

    if (imageUrl !== undefined) {
      updates.imageUrl =
        imageUrl ? String(imageUrl).trim() : "";
    }

    if (priceId !== undefined) {
      updates.priceId =
        priceId ? String(priceId).trim() : null;
    }

    if (fileKey !== undefined) {
      updates.fileKey =
        fileKey ? String(fileKey).trim() : null;
    }

    if (visible !== undefined) {
      updates.visible = Boolean(visible);
    }

    if (category !== undefined) {
      if (!String(category).trim()) {
        return res.status(400).json({
          error: "Category is required",
        });
      }

      updates.category =
        String(category).trim();
    }

    if (tags !== undefined) {
      updates.tags = normalizeTags(tags);
    }

    if (isFree !== undefined) {
      updates.isFree = Boolean(isFree);
    }

    /*
    |--------------------------------------------------------------------------
    | Keep productType immutable
    |--------------------------------------------------------------------------
    |
    | We intentionally do NOT accept productType changes here.
    |
    |--------------------------------------------------------------------------
    */

    const product =
      await Product.findByIdAndUpdate(
        id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    console.log("✅ PRODUCT UPDATED:", product._id);
    console.log(
      "💰 Stored price in cents:",
      product.price
    );
    console.log(
      "💵 Display price:",
      `$${(product.price / 100).toFixed(2)}`
    );

    return res.json({
      message: "✓ Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Failed to update product",
    });
  }
});

/*
|--------------------------------------------------------------------------
| PATCH /api/admin/products/:id/toggle-visibility
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/toggle-visibility",
  async (req, res) => {
    try {
      const { id } = req.params;

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      product.visible = !product.visible;

      await product.save();

      return res.json({
        message: `✓ Product ${
          product.visible
            ? "shown"
            : "hidden"
        }`,
        visible: product.visible,
      });
    } catch (error) {
      console.error(
        "❌ Error toggling visibility:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to toggle product visibility",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE /api/admin/products/:id
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    console.log(
      "🗑 PRODUCT DELETED:",
      product._id,
      product.title
    );

    return res.json({
      message: "✓ Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error(
      "❌ Error deleting product:",
      error
    );

    return res.status(500).json({
      error: "Failed to delete product",
    });
  }
});

module.exports = router;