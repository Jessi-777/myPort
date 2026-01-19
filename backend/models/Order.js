// backend/models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // Stripe information
    stripeSessionId: {
      type: String,
      required: true,
      unique: true
    },

    stripePaymentIntentId: {
      type: String,
      default: null
    },

    // Printify order information
    printifyOrderId: {
      type: String,
      default: null
    },

    printifyShopId: {
      type: String,
      default: null
    },

    // Product information
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        printifyProductId: String,
        variantId: String,
        title: String,
        quantity: Number,
        price: Number, // in cents
      }
    ],

    // Shipping address
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      province: String,
      country: String,
      zip: String,
    },

    // Order status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'],
      default: 'pending'
    },

    // Totals
    subtotal: Number, // in cents
    shipping: Number, // in cents
    tax: Number,      // in cents
    total: Number,    // in cents

    // Timestamps
    paidAt: Date,
    fulfilledAt: Date,
    shippedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
