// frontend/src/components/AdminProductManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productType: "digital",
    price: "",
    imageUrl: "",
    priceId: "",
    fileKey: "",
    category: "",
    tags: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load products and stats
  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/products/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      productType: "digital",
      price: "",
      imageUrl: "",
      priceId: "",
      fileKey: "",
      category: "",
      tags: "",
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        visible: true,
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `${API}/api/admin/products/${editingId}`,
          submitData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        response = await axios.post(`${API}/api/admin/products`, submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      setMessage(response.data.message);
      resetForm();
      setShowForm(false);
      loadProducts();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("✓ Product deleted");
      loadProducts();
      loadStats();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await axios.patch(`${API}/api/admin/products/${id}/toggle-visibility`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage(`✓ Product ${!currentVisible ? "shown" : "hidden"}`);
      loadProducts();
    } catch (err) {
      setError("Failed to toggle visibility");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      productType: product.productType,
      price: (product.price / 100).toFixed(2),
      imageUrl: product.imageUrl || "",
      priceId: product.priceId || "",
      fileKey: product.fileKey || "",
      category: product.category || "",
      tags: product.tags?.join(", ") || "",
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-white text-center p-8">Loading products...</div>;
  }

  return (
    <div className="bg-[#1f2227] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">📦 Product Manager</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              resetForm();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded mb-6">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0e0f10] border border-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-[#0e0f10] border border-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">📥 Digital</p>
              <p className="text-3xl font-bold text-blue-400">{stats.digital}</p>
            </div>
            <div className="bg-[#0e0f10] border border-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">🛍️ Physical</p>
              <p className="text-3xl font-bold text-purple-400">{stats.physical}</p>
            </div>
            <div className="bg-[#0e0f10] border border-gray-700 p-4 rounded">
              <p className="text-gray-400 text-sm">Visible</p>
              <p className="text-3xl font-bold text-green-400">{stats.visible}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-[#0e0f10] border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Classic T-Shirt"
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Type *
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    disabled={editingId}
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                  >
                    <option value="digital">📥 Digital (Music, Art, Files)</option>
                    <option value="physical">🛍️ Physical (Originals, Apparel)</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="19.99"
                    step="0.01"
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Music, Art, Fashion"
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product details..."
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                />
              </div>

              {/* Digital-specific fields */}
              {formData.productType === "digital" && (
                <div className="grid grid-cols-2 gap-4 bg-blue-500/10 border border-blue-500/30 p-4 rounded">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Stripe Price ID
                    </label>
                    <input
                      type="text"
                      name="priceId"
                      value={formData.priceId}
                      onChange={handleInputChange}
                      placeholder="price_xxx"
                      className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      S3 File Key
                    </label>
                    <input
                      type="text"
                      name="fileKey"
                      value={formData.fileKey}
                      onChange={handleInputChange}
                      placeholder="path/to/file.zip"
                      className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="music, original, exclusive"
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid gap-6">
          {products.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No products yet. Create one to get started!
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-[#0e0f10] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {product.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {product.productType === "digital" ? "📥 Digital" : "🛍️ Physical"}
                          {product.category && ` • ${product.category}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[#a9d0de]">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                        <p className={`text-sm font-semibold ${product.visible ? "text-green-400" : "text-gray-500"}`}>
                          {product.visible ? "✓ Visible" : "Hidden"}
                        </p>
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-gray-300 mb-3">{product.description}</p>
                    )}

                    {product.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleToggleVisibility(product._id, product.visible)
                        }
                        className={`px-4 py-2 rounded text-sm font-semibold ${
                          product.visible
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-gray-600 hover:bg-gray-700 text-white"
                        }`}
                      >
                        {product.visible ? "👁️ Hide" : "👁️ Show"}
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold ml-auto"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManager;
