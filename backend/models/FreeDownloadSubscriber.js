const mongoose = require("mongoose");

const FreeDownloadSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    marketingConsent: {
      type: Boolean,
      default: false,
    },

    consentedAt: {
      type: Date,
      default: null,
    },

    source: {
      type: String,
      default: "free-download",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate email/product records.
FreeDownloadSubscriberSchema.index(
  { email: 1, product: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "FreeDownloadSubscriber",
  FreeDownloadSubscriberSchema
);

