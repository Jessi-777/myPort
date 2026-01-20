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
  const [uploading, setUploading] = useState(false);

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
      console.log("Loading products from:", `${API}/api/admin/products`);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No admin token found. Please log in again.");
      }
      const { data } = await axios.get(`${API}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Products loaded:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products:", err);
      // If token is invalid, clear it and redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        setError("Session expired. Please log in again.");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError("Failed to load products: " + (err.response?.data?.error || err.message));
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log("Loading stats from:", `${API}/api/admin/products/stats`);
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const { data } = await axios.get(`${API}/api/admin/products/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Stats loaded:", data);
      setStats(data || { total: 0, digital: 0, physical: 0, visible: 0 });
    } catch (err) {
      console.error("Failed to load stats:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
      }
      setStats({ total: 0, digital: 0, physical: 0, visible: 0 });
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
    
    // If changing price, clear priceId to avoid confusion
    if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        priceId: '', // Clear priceId when price changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          // Upload to Cloudinary via backend
          const { data } = await axios.post(
            `${API}/api/admin/upload-image`,
            {
              image: reader.result,
              folder: 'products',
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
            }
          );

          // Update form with Cloudinary URL
          setFormData(prev => ({
            ...prev,
            imageUrl: data.url,
          }));

          setMessage('✓ Image uploaded successfully');
          setTimeout(() => setMessage(''), 3000);
        } catch (err) {
          console.error('Image upload error:', err);
          setError(err.response?.data?.error || 'Failed to upload image');
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
    } catch (err) {
      console.error('File read error:', err);
      setError('Failed to process image');
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB max for digital files)
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be less than 50MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const { data } = await axios.post(
            `${API}/api/admin/upload-file`,
            {
              file: reader.result,
              folder: 'digital-files',
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
            }
          );

          // Update form with Cloudinary URL
          setFormData(prev => ({
            ...prev,
            fileKey: data.url,
          }));

          setMessage(`✓ File uploaded (${(data.bytes / 1024 / 1024).toFixed(2)} MB)`);
          setTimeout(() => setMessage(''), 3000);
        } catch (err) {
          console.error('File upload error:', err);
          setError(err.response?.data?.error || 'Failed to upload file');
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
    } catch (err) {
      console.error('File read error:', err);
      setError('Failed to process file');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted!");
    console.log("Form data:", formData);
    
    setMessage("");
    setError("");

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        visible: true,
      };

      console.log("📦 Submit data prepared:", submitData);
      console.log("API URL:", API);
      console.log("Token:", localStorage.getItem("adminToken") ? "exists" : "missing");

      let response;
      if (editingId) {
        console.log(`✏️ Updating product ${editingId}`);
        response = await axios.put(
          `${API}/api/admin/products/${editingId}`,
          submitData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
      } else {
        console.log("➕ Creating new product");
        response = await axios.post(`${API}/api/admin/products`, submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
      }

      console.log("✅ Response:", response.data);
      setMessage(response.data.message);
      resetForm();
      setShowForm(false);
      loadProducts();
      loadStats();
    } catch (err) {
      console.error("❌ Submit error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError(err.response?.data?.error || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
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
    return (
      <div className="min-h-screen bg-[#1f2227] flex items-center justify-center">
        <div className="text-white text-center p-8">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
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
          <div className="bg-[#0e0f10] border border-gray-800 rounded-lg p-6 mb-8">
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
                    <option value="digital">📥 Digital (Music, Art Files, Downloads)</option>
                    <option value="physical">🛍️ Physical (Custom Items, Originals)</option>
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
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                  >
                    <option value="">Select category...</option>
                    <option value="Music">🎵 Music</option>
                    <option value="Art">🎨 Art</option>
                    <option value="Film">🎬 Film</option>
                    <option value="Fashion">👕 Fashion</option>
                    <option value="Original">⭐ Original Piece</option>
                    <option value="Other">📦 Other</option>
                  </select>
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

              {/* Image Upload */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Product Image
                </label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="relative w-full h-48 bg-gray-800 rounded border border-gray-600 overflow-hidden">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded text-center font-semibold">
                        {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    
                    {/* Or paste URL */}
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="Or paste image URL"
                      className="flex-1 bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                  </div>
                  <p className="text-gray-400 text-xs">Max 5MB • JPG, PNG, GIF, WebP</p>
                </div>
              </div>

              {/* Digital-specific fields */}
              {formData.productType === "digital" && (
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <span>📥</span>
                    <span>Upload Digital File (Music, Art, etc.)</span>
                  </div>
                  
                  {/* File Preview/Upload */}
                  {formData.fileKey && (
                    <div className="bg-gray-800 p-3 rounded border border-gray-600">
                      <p className="text-white text-sm mb-1">✓ File uploaded:</p>
                      <p className="text-gray-400 text-xs break-all mb-3">{formData.fileKey}</p>
                      
                      {/* Audio Preview */}
                      {formData.fileKey.match(/\.(mp3|wav|m4a|ogg)$/i) && (
                        <div className="mb-3">
                          <p className="text-white text-xs mb-2">🎵 Preview:</p>
                          <audio 
                            controls 
                            className="w-full max-w-md"
                            src={formData.fileKey}
                          >
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, fileKey: '' }))}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div>
                    <label className="cursor-pointer block">
                      <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded text-center font-semibold">
                        {uploading ? '⏳ Uploading...' : formData.fileKey ? '🔄 Replace File' : '📤 Upload File (MP3, ZIP, etc.)'}
                      </div>
                      <input
                        type="file"
                        accept=".mp3,.wav,.zip,.pdf,.mp4"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-400 text-xs mt-2">Max 50MB • MP3, WAV, ZIP, PDF, MP4</p>
                  </div>

                  {/* Stripe Price ID (Optional) */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Stripe Price ID (Optional)
                    </label>
                    <input
                      type="text"
                      name="priceId"
                      value={formData.priceId}
                      onChange={handleInputChange}
                      placeholder="price_xxxxx (leave empty to auto-create)"
                      className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded"
                    />
                    <p className="text-gray-400 text-xs mt-1">Stripe will auto-create one if left empty</p>
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
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded"
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
            products.map((product) => {
              console.log(`Product ${product.title} imageUrl:`, product.imageUrl);
              return (
              <div
                key={product._id}
                className="bg-[#0e0f10] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) => {
                          console.error(`Failed to load image for ${product.title}:`, e.target.src);
                        }}
                      />
                    )}
                    
                    {/* Audio Preview for Digital Products */}
                    {product.productType === 'digital' && product.fileKey && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-1">🎵 Preview:</p>
                        <audio 
                          controls 
                          className="w-32 h-8"
                          style={{ maxWidth: '128px' }}
                        >
                          <source src={product.fileKey} type="audio/mpeg" />
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    )}
                  </div>

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
                        className="bg-[#607b93] hover:bg-[#52789a] text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleToggleVisibility(product._id, product.visible)
                        }
                        className={`px-4 py-2 rounded text-sm font-semibold ${
                          product.visible
                            ? "bg-[#607b93] hover:bg-[#52789a] text-white"
                            : "bg-[#600] hover:bg-[#efefef] text-white"
                        }`}
                      >
                        {product.visible ? "👁️ Hide" : "👁️ Show"}
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded text-sm font-semibold ml-auto"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManager;
