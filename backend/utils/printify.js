// backend/utils/printify.js
const axios = require("axios");

const PRINTIFY_API_URL = "https://api.printify.com/v1";
const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;

if (!PRINTIFY_API_KEY) {
  console.warn("⚠️ PRINTIFY_API_KEY not set in .env");
}

/**
 * Printify API Client
 */
const printifyAPI = axios.create({
  baseURL: PRINTIFY_API_URL,
  headers: {
    Authorization: `Bearer ${PRINTIFY_API_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Get all shops
 */
const getShops = async () => {
  try {
    const { data } = await printifyAPI.get("/shops");
    return data;
  } catch (error) {
    console.error("❌ Error fetching shops:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get products for a specific shop
 */
const getProducts = async (shopId) => {
  try {
    const { data } = await printifyAPI.get(`/shops/${shopId}/products`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get single product details
 */
const getProduct = async (shopId, productId) => {
  try {
    const { data } = await printifyAPI.get(`/shops/${shopId}/products/${productId}`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching product:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create an order with Printify
 * @param {string} shopId - Printify shop ID
 * @param {Object} orderData - Order details with line items
 */
const createOrder = async (shopId, orderData) => {
  try {
    const { data } = await printifyAPI.post(`/shops/${shopId}/orders`, orderData);
    return data;
  } catch (error) {
    console.error("❌ Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get order details
 */
const getOrder = async (shopId, orderId) => {
  try {
    const { data } = await printifyAPI.get(`/shops/${shopId}/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error("❌ Error fetching order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cancel an order
 */
const cancelOrder = async (shopId, orderId) => {
  try {
    const { data } = await printifyAPI.delete(`/shops/${shopId}/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error("❌ Error canceling order:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  getShops,
  getProducts,
  getProduct,
  createOrder,
  getOrder,
  cancelOrder,
  printifyAPI,
};
