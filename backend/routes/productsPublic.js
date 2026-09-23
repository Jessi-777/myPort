const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const FreeDownloadSubscriber = require(
  "../models/FreeDownloadSubscriber"
);
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ==================================================
// GET PUBLIC PRODUCTS
// ==================================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({
      visible: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(
      "Public product fetch error:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
});

// ==================================================
// POST FREE DOWNLOAD SIGNUP
// ==================================================

router.post("/:id/free-download", async (req, res) => {
  try {
    const { email, marketingConsent } = req.body;

    // ----------------------------------------------
    // VALIDATE PRODUCT ID
    // ----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        error: "Invalid product ID.",
      });
    }

    // ----------------------------------------------
    // VALIDATE EMAIL
    // ----------------------------------------------

    const normalizedEmail = String(
      email || ""
    )
      .trim()
      .toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        error:
          "Please provide a valid email address.",
      });
    }

    // ----------------------------------------------
    // FIND PRODUCT
    // ----------------------------------------------

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found.",
      });
    }

    // ----------------------------------------------
    // SECURITY CHECKS
    // ----------------------------------------------

    if (product.visible !== true) {
      return res.status(404).json({
        error: "Product not available.",
      });
    }

    if (product.isFree !== true) {
      return res.status(403).json({
        error:
          "This product is not available as a free download.",
      });
    }

    if (
      product.productType !== "digital"
    ) {
      return res.status(400).json({
        error:
          "This product is not a digital download.",
      });
    }

    if (!product.fileKey) {
      return res.status(409).json({
        error:
          "This free product does not have a download file.",
      });
    }

    // ----------------------------------------------
    // MARKETING CONSENT
    // ----------------------------------------------

    const hasMarketingConsent =
      marketingConsent === true;

    // ----------------------------------------------
    // SAVE / UPDATE SUBSCRIBER
    // ----------------------------------------------

    await FreeDownloadSubscriber.findOneAndUpdate(
      {
        email: normalizedEmail,
        product: product._id,
      },
      {
        $set: {
          marketingConsent:
            hasMarketingConsent,

          consentedAt: hasMarketingConsent
            ? new Date()
            : null,

          source: "free-download",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // ----------------------------------------------
    // SEND DOWNLOAD EMAIL
    // ----------------------------------------------

    const isApp = product.tags?.includes("app");

    await sendEmail({
      to: normalizedEmail,
      subject: `Your Free ${isApp ? "App" : "Song"} Is Ready 🎵✨`,
      html: `
        <h2>Thanks for grabbing ${product.title}!</h2>
        <p>Your free ${isApp ? "app" : "download"} is ready:</p>
        <a href="${product.fileKey}">Access Your ${isApp ? "App" : "Download"}</a>
      `,
    });

    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Free download signup successful.",

      productId: product._id,

      downloadUrl: product.fileKey,
    });
  } catch (err) {
    console.error(
      "Free download signup error:",
      err
    );

    return res.status(500).json({
      error:
        "Unable to process free download.",
    });
  }
});

module.exports = router;




// // routes/productsPublic.js
// const express = require("express");
// const Product = require("../models/Product");
// const router = express.Router();

// // GET public products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find({ visible: true }).sort({ createdAt: -1 });
//     res.json(products);
//   } catch (err) {
//     console.error("Public product fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// module.exports = router;
