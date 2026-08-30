const mongoose = require("mongoose");

const AnalyticsEventSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    event: {
      type: String,
      enum: [
        "page_view",
        "heartbeat",
        "page_exit",
        "product_view",
        "add_to_cart",
        "checkout_started",
        "purchase",
        "signup",
        "login",
        "contact",
        "custom",
      ],
      required: true,
      index: true,
    },

    page: {
      type: String,
      default: "/",
      index: true,
    },

    title: {
      type: String,
      default: "",
    },

    referrer: {
      type: String,
      default: "",
    },

    trafficSource: {
      type: String,
      default: "Direct",
      index: true,
    },

    utmSource: {
      type: String,
      default: "",
    },

    utmMedium: {
      type: String,
      default: "",
    },

    utmCampaign: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "Unknown",
      index: true,
    },

    region: {
      type: String,
      default: "Unknown",
    },

    city: {
      type: String,
      default: "Unknown",
    },

    timezone: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    ipHash: {
      type: String,
      default: "",
      index: true,
    },

    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
      default: "Unknown",
      index: true,
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    os: {
      type: String,
      default: "Unknown",
    },

    screenWidth: {
      type: Number,
      default: null,
    },

    screenHeight: {
      type: Number,
      default: null,
    },

    language: {
      type: String,
      default: "",
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes for analytics queries.
AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ event: 1, createdAt: -1 });
AnalyticsEventSchema.index({ visitorId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ sessionId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ page: 1, createdAt: -1 });

module.exports = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);