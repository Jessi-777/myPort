const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
    },

    description: { 
      type: String, 
      default: "",
      trim: true,
    },

    // Option 1: Digital products with Stripe
    priceId: { 
      type: String, // Stripe price ID (for digital products)
      default: null
    },

    fileKey: { 
      type: String,  // S3 key for digital product file
      default: null
    },

    // Option 2: Physical products from Printify
    printifyProductId: {
      type: String,
      default: null
    },

    printifyShopId: {
      type: String,
      default: null
    },

    // Product type: 'digital' or 'physical'
    productType: {
      type: String,
      enum: ['digital', 'physical'],
      default: 'digital'
    },

    // Pricing (both digital and physical can use this)
    price: {
      type: Number, // in cents (e.g., 1999 = $19.99)
      required: true
    },

    imageUrl: { 
      type: String, 
      default: "" 
    },

    visible: { 
      type: Boolean, 
      default: true 
    },

    // Printify-specific metadata
    printifyData: {
      variants: [
        {
          variantId: String,
          title: String,
          price: Number,
          available: Boolean,
        }
      ],
      images: [
        {
          src: String,
          position: Number,
        }
      ]
    },

    tags: [String],
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);




// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, default: "" },
//     priceId: { type: String, required: true },   // Stripe Price ID
//     imageUrl: { type: String, default: "" },     // public image (CDN/S3)
//     fileKey: { type: String, required: true },   // private S3 key for download
//     visible: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);

