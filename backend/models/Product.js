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

    priceId: { 
      type: String, // Stripe price ID
      required: true 
    },

    imageUrl: { 
      type: String, 
      default: "" 
    },

    fileKey: { 
      type: String,  // S3 key or secure storage key
      required: true 
    },

    visible: { 
      type: Boolean, 
      default: true 
    },

    // Optional:
    // tags: [String],
    // category: String,
    // free: Boolean, 
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

