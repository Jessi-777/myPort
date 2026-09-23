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

    /*
     * Stripe Price ID.
     *
     * Used for paid DIGITAL products when a Stripe
     * Price already exists.
     *
     * Example:
     * price_1ABC123...
     */
    priceId: {
      type: String,
      default: null,
      trim: true,
    },

    /*
     * Digital download location.
     *
     * This can be a Cloudinary URL, storage URL,
     * or another protected/public file location.
     */
    fileKey: {
      type: String,
      default: null,
      trim: true,
    },

    /*
     * Printify information.
     *
     * These fields are preserved for physical products.
     */
    printifyProductId: {
      type: String,
      default: null,
      trim: true,
    },

    printifyShopId: {
      type: String,
      default: null,
      trim: true,
    },

    /*
     * Product type.
     */
    productType: {
      type: String,
      enum: ["digital", "physical"],
      default: "digital",
      required: true,
    },

    /*
     * PRICE IS ALWAYS STORED IN CENTS.
     *
     * Example:
     * $19.99 -> 1999
     * $2.05  -> 205
     * $0.00  -> 0
     */
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * Free products.
     *
     * A free digital product can exist without
     * requiring Stripe checkout.
     */
    isFree: {
      type: Boolean,
      default: false,
    },

    /*
     * Coming soon.
     *
     * Product is visible in the shop but purchasing
     * is disabled (e.g. fulfillment isn't set up yet).
     */
    comingSoon: {
      type: Boolean,
      default: false,
    },

    /*
     * Product image.
     */
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    /*
     * Store visibility.
     */
    visible: {
      type: Boolean,
      default: true,
    },

    /*
     * Printify product information.
     */
    printifyData: {
      variants: [
        {
          variantId: {
            type: String,
            default: null,
          },

          title: {
            type: String,
            default: "",
          },

          price: {
            type: Number,
            default: 0,
          },

          available: {
            type: Boolean,
            default: true,
          },
        },
      ],

      images: [
        {
          src: {
            type: String,
            default: "",
          },

          position: {
            type: Number,
            default: 0,
          },
        },
      ],
    },

    /*
     * Product organization.
     */
    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);