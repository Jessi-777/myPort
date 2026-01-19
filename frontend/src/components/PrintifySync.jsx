// frontend/src/components/PrintifySync.jsx
import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const PrintifySync = () => {
  const [shopId, setShopId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shops, setShops] = useState([]);
  const [showShops, setShowShops] = useState(false);

  /**
   * Fetch available Printify shops
   */
  const handleGetShops = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API}/api/printify/shops`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setShops(response.data.data || response.data);
      setShowShops(true);
    } catch (err) {
      setError("Failed to fetch shops. Make sure PRINTIFY_API_KEY is set.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync products from selected shop
   */
  const handleSyncProducts = async (e) => {
    e.preventDefault();

    if (!shopId) {
      setError("Please select or enter a shop ID");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API}/api/printify/sync-products`, {
        shopId,
      });

      setMessage(`✓ ${response.data.message}`);
      setShopId("");
      setShowShops(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to sync products. Check API key."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0e0f10] border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">📦 Printify Sync</h2>

      {message && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSyncProducts} className="space-y-4">
        {/* Get Shops Button */}
        <button
          type="button"
          onClick={handleGetShops}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded"
        >
          {loading && showShops ? "Loading Shops..." : "Show My Printify Shops"}
        </button>

        {/* Shop Selection */}
        {showShops && shops.length > 0 && (
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Select Shop:
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
            >
              <option value="">-- Select a shop --</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.title} (ID: {shop.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Manual Shop ID Input */}
        <div>
          <label className="text-white text-sm font-semibold mb-2 block">
            Or Paste Shop ID:
          </label>
          <input
            type="text"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            placeholder="Your Printify Shop ID"
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
          />
        </div>

        {/* Sync Button */}
        <button
          type="submit"
          disabled={loading || !shopId}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded"
        >
          {loading ? "Syncing..." : "Sync Products"}
        </button>
      </form>

      <p className="text-gray-400 text-xs mt-4">
        💡 Find your Shop ID at:{" "}
        <a
          href="https://dashboard.printify.com/shops"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Printify Dashboard
        </a>
      </p>
    </div>
  );
};

export default PrintifySync;
