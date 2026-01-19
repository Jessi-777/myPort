// backend/webhook/printifyFulfillment.js
/**
 * Handle Stripe payment success → Create Printify Order
 * This integrates with the Stripe webhook
 */

const Order = require("../models/Order");
const Product = require("../models/Product");
const { createOrder: createPrintifyOrder, getShops } = require("../utils/printify");

/**
 * Process order fulfillment after successful Stripe payment
 * @param {Object} session - Stripe checkout session
 */
const fulfillOrder = async (session) => {
  try {
    // Find order by Stripe session ID
    const order = await Order.findOne({ stripeSessionId: session.id });

    if (!order) {
      console.log("⚠️ Order not found for session:", session.id);
      return;
    }

    // If this is a physical product order, create it in Printify
    const hasPhysicalProducts = order.items.some(item =>
      item.printifyProductId || item.variantId
    );

    if (hasPhysicalProducts) {
      // Get shipping info from Stripe session
      const customerDetails = session.customer_details || {};
      const shippingDetails = session.shipping_details?.address || {};

      // Get shop ID (assumes single shop for now)
      const shops = await getShops();
      if (!shops.data || shops.data.length === 0) {
        throw new Error("No Printify shops configured");
      }

      const shopId = shops.data[0].id;

      // Build Printify order
      const printifyLineItems = [];

      for (const item of order.items) {
        printifyLineItems.push({
          product_id: item.printifyProductId,
          variant_id: parseInt(item.variantId),
          quantity: item.quantity,
        });
      }

      // Create order in Printify
      const printifyOrder = await createPrintifyOrder(shopId, {
        line_items: printifyLineItems,
        shipping_address: {
          first_name: customerDetails.name?.split(" ")[0] || "Customer",
          last_name: customerDetails.name?.split(" ")[1] || "",
          email: customerDetails.email,
          phone: customerDetails.phone || "",
          address1: shippingDetails.line1 || "",
          address2: shippingDetails.line2 || "",
          city: shippingDetails.city || "",
          province: shippingDetails.state || "",
          country: shippingDetails.country || "US",
          zip: shippingDetails.postal_code || "",
        },
        send_to_production: true, // Auto-submit order
      });

      // Update order with Printify info
      await Order.updateOne(
        { _id: order._id },
        {
          printifyOrderId: printifyOrder.id,
          printifyShopId: shopId,
          status: "confirmed",
          paidAt: new Date(),
          shippingAddress: {
            firstName: customerDetails.name?.split(" ")[0] || "Customer",
            lastName: customerDetails.name?.split(" ")[1] || "",
            email: customerDetails.email,
            phone: customerDetails.phone || "",
            address1: shippingDetails.line1 || "",
            address2: shippingDetails.line2 || "",
            city: shippingDetails.city || "",
            province: shippingDetails.state || "",
            country: shippingDetails.country || "US",
            zip: shippingDetails.postal_code || "",
          },
        }
      );

      console.log(`✓ Printify order created: ${printifyOrder.id}`);
    } else {
      // Digital product - just mark as confirmed
      await Order.updateOne(
        { _id: order._id },
        {
          status: "confirmed",
          paidAt: new Date(),
        }
      );

      console.log(`✓ Digital order confirmed: ${order._id}`);
    }
  } catch (error) {
    console.error("❌ Fulfillment error:", error);
  }
};

module.exports = { fulfillOrder };
