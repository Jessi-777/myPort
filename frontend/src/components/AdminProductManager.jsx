import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const EMPTY_FORM = {
  title: "",
  description: "",
  productType: "digital",
  price: "",
  imageUrl: "",
  priceId: "",
  fileKey: "",
  category: "",
  tags: "",
};

const DEFAULT_STATS = {
  total: 0,
  digital: 0,
  physical: 0,
  visible: 0,
};

const AdminProductManager = ({ token, onUnauthorized }) => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ------------------------------------------------------------
  // AUTH HEADERS
  // ------------------------------------------------------------

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ------------------------------------------------------------
  // UNAUTHORIZED HANDLER
  // ------------------------------------------------------------

  const handleUnauthorized = () => {
    setError("Your admin session has expired. Please log in again.");

    if (onUnauthorized) {
      setTimeout(() => {
        onUnauthorized();
      }, 800);
    }
  };

  // ------------------------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------------------------

  useEffect(() => {
    if (!token) return;

    loadProducts();
    loadStats();
  }, [token]);

  // ------------------------------------------------------------
  // LOAD PRODUCTS
  // ------------------------------------------------------------

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${API}/api/admin/products`, {
        headers: authHeaders,
      });

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load products:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // LOAD STATS
  // ------------------------------------------------------------

  const loadStats = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/admin/products/stats`,
        {
          headers: authHeaders,
        }
      );

      setStats(data || DEFAULT_STATS);
    } catch (err) {
      console.error("Failed to load stats:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setStats(DEFAULT_STATS);
    }
  };

  // ------------------------------------------------------------
  // FORM HELPERS
  // ------------------------------------------------------------

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        price: value,
        priceId: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------------------------
  // IMAGE UPLOAD
  // ------------------------------------------------------------

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }

    setUploading(true);
    setUploadType("image");
    setError("");
    setMessage("");

    try {
      const reader = new FileReader();

      const imageData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image."));
        reader.readAsDataURL(file);
      });

      const { data } = await axios.post(
        `${API}/api/admin/upload-image`,
        {
          image: imageData,
          folder: "products",
        },
        {
          headers: authHeaders,
        }
      );

      if (!data?.url) {
        throw new Error("Image upload succeeded but no URL was returned.");
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));

      showSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
      setUploadType("");
      e.target.value = "";
    }
  };

  // ------------------------------------------------------------
  // DIGITAL FILE UPLOAD
  // ------------------------------------------------------------

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError("Digital files must be less than 50MB.");
      return;
    }

    setUploading(true);
    setUploadType("file");
    setError("");
    setMessage("");

    try {
      const reader = new FileReader();

      const fileData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
      });

      const { data } = await axios.post(
        `${API}/api/admin/upload-file`,
        {
          file: fileData,
          folder: "digital-files",
        },
        {
          headers: authHeaders,
        }
      );

      if (!data?.url) {
        throw new Error("File upload succeeded but no URL was returned.");
      }

      setFormData((prev) => ({
        ...prev,
        fileKey: data.url,
      }));

      const size =
        data.bytes
          ? ` (${(data.bytes / 1024 / 1024).toFixed(2)} MB)`
          : "";

      showSuccess(`Digital file uploaded${size}.`);
    } catch (err) {
      console.error("File upload error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to upload file."
      );
    } finally {
      setUploading(false);
      setUploadType("");
      e.target.value = "";
    }
  };

  // ------------------------------------------------------------
  // SUCCESS MESSAGE
  // ------------------------------------------------------------

  const showSuccess = (text) => {
    setError("");
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  // ------------------------------------------------------------
  // CREATE / UPDATE PRODUCT
  // ------------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const numericPrice = parseFloat(formData.price);

      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        throw new Error("Please enter a valid product price.");
      }

      const submitData = {
        ...formData,
        price: numericPrice,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        visible: true,
      };

      let response;

      if (editingId) {
        response = await axios.put(
          `${API}/api/admin/products/${editingId}`,
          submitData,
          {
            headers: authHeaders,
          }
        );
      } else {
        response = await axios.post(
          `${API}/api/admin/products`,
          submitData,
          {
            headers: authHeaders,
          }
        );
      }

      showSuccess(
        response.data?.message ||
          (editingId
            ? "Product updated successfully."
            : "Product created successfully.")
      );

      resetForm();
      setShowForm(false);

      await Promise.all([loadProducts(), loadStats()]);
    } catch (err) {
      console.error("Product save error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // DELETE
  // ------------------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this product permanently?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API}/api/admin/products/${id}`, {
        headers: authHeaders,
      });

      showSuccess("Product deleted successfully.");

      await Promise.all([loadProducts(), loadStats()]);
    } catch (err) {
      console.error("Delete error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ------------------------------------------------------------
  // TOGGLE VISIBILITY
  // ------------------------------------------------------------

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API}/api/admin/products/${id}/toggle-visibility`,
        {},
        {
          headers: authHeaders,
        }
      );

      showSuccess(
        currentVisible
          ? "Product hidden from the store."
          : "Product is now visible in the store."
      );

      await Promise.all([loadProducts(), loadStats()]);
    } catch (err) {
      console.error("Visibility error:", err);

      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update product visibility."
      );
    }
  };

  // ------------------------------------------------------------
  // EDIT
  // ------------------------------------------------------------

  const handleEdit = (product) => {
    setFormData({
      title: product.title || "",
      description: product.description || "",
      productType: product.productType || "digital",
      price:
        typeof product.price === "number"
          ? (product.price / 100).toFixed(2)
          : "",
      imageUrl: product.imageUrl || "",
      priceId: product.priceId || "",
      fileKey: product.fileKey || "",
      category: product.category || "",
      tags: product.tags?.join(", ") || "",
    });

    setEditingId(product._id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ------------------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-2 border-white/10 border-t-[#a9d0de] rounded-full animate-spin" />

          <p className="mt-5 text-gray-400 font-medium">
            Loading your products...
          </p>

          <p className="mt-1 text-xs text-gray-600">
            Connecting to your store
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ==========================================================
          PAGE HEADER
      ========================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Admin</span>
            <span>›</span>
            <span className="text-gray-400">Products</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Product Manager
          </h2>

          <p className="text-gray-500 mt-1">
            Manage your digital and physical products.
          </p>
        </div>

        <button
          type="button"
          onClick={showForm ? closeForm : openCreateForm}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
            showForm
              ? "bg-white/10 hover:bg-white/15 text-white border border-white/10"
              : "bg-[#607b93] hover:bg-[#6f8da8] text-white shadow-lg shadow-black/20"
          }`}
        >
          <span className="text-lg">
            {showForm ? "×" : "+"}
          </span>

          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* ==========================================================
          ALERTS
      ========================================================== */}

      {message && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <span className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
            ✓
          </span>

          <span className="text-sm font-medium">
            {message}
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
          <span className="w-7 h-7 shrink-0 rounded-full bg-red-500/15 flex items-center justify-center">
            !
          </span>

          <span className="text-sm font-medium pt-1">
            {error}
          </span>
        </div>
      )}

      {/* ==========================================================
          STATS
      ========================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Products"
          value={stats.total}
          icon="📦"
        />

        <StatCard
          label="Digital"
          value={stats.digital}
          icon="🎵"
        />

        <StatCard
          label="Physical"
          value={stats.physical}
          icon="🛍️"
        />

        <StatCard
          label="Visible"
          value={stats.visible}
          icon="👁️"
        />
      </div>

      {/* ==========================================================
          PRODUCT FORM
      ========================================================== */}

      {showForm && (
        <div className="bg-[#111419] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl">
          {/* Form Header */}
          <div className="px-5 sm:px-7 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#a9d0de] font-bold">
                {editingId ? "Edit Product" : "New Product"}
              </p>

              <h3 className="text-xl font-bold mt-1">
                {editingId
                  ? "Update product details"
                  : "Create something new"}
              </h3>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-7 space-y-7"
          >
            {/* ======================================================
                BASIC INFORMATION
            ====================================================== */}

            <FormSection
              number="01"
              title="Basic Information"
              description="Give your product a clear identity."
            >
              <div className="grid md:grid-cols-2 gap-5">
                <FormField label="Product Title" required>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Classic T-Shirt"
                    className="input"
                  />
                </FormField>

                <FormField label="Product Type" required>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    disabled={!!editingId}
                    className="input"
                  >
                    <option value="digital">
                      📥 Digital
                    </option>

                    <option value="physical">
                      🛍️ Physical
                    </option>
                  </select>
                </FormField>

                <FormField label="Price" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="19.99"
                      className="input pl-8"
                    />
                  </div>
                </FormField>

                <FormField label="Category" required>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="input"
                  >
                    <option value="">
                      Select category...
                    </option>
                    <option value="Music">🎵 Music</option>
                    <option value="Art">🎨 Art</option>
                    <option value="Film">🎬 Film</option>
                    <option value="Fashion">👕 Fashion</option>
                    <option value="Original">
                      ⭐ Original Piece
                    </option>
                    <option value="Other">📦 Other</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell customers what makes this product special..."
                  className="input resize-none"
                />
              </FormField>
            </FormSection>

            {/* ======================================================
                IMAGE
            ====================================================== */}

            <FormSection
              number="02"
              title="Product Image"
              description="Upload a product image or provide an image URL."
            >
              <div className="grid lg:grid-cols-[240px_1fr] gap-5">
                {/* Preview */}
                <div className="aspect-square lg:aspect-auto lg:h-[240px] rounded-xl bg-[#0b0d10] border border-white/[0.07] overflow-hidden relative">
                  {formData.imageUrl ? (
                    <>
                      <img
                        src={formData.imageUrl}
                        alt={formData.title || "Product preview"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: "",
                          }))
                        }
                        className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white w-8 h-8 rounded-lg transition"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                      <span className="text-4xl mb-2">🖼️</span>
                      <span className="text-xs">
                        Image preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block cursor-pointer">
                    <div className="border border-dashed border-white/15 hover:border-[#a9d0de]/50 rounded-xl p-6 text-center transition bg-white/[0.015] hover:bg-white/[0.03]">
                      <div className="text-2xl mb-2">
                        {uploading && uploadType === "image"
                          ? "⏳"
                          : "📤"}
                      </div>

                      <p className="font-semibold text-gray-200">
                        {uploading && uploadType === "image"
                          ? "Uploading image..."
                          : "Upload product image"}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        JPG, PNG, GIF or WebP · Max 5MB
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <div className="h-px bg-white/[0.06] flex-1" />
                    <span className="text-xs text-gray-600">
                      OR
                    </span>
                    <div className="h-px bg-white/[0.06] flex-1" />
                  </div>

                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Paste image URL"
                    className="input"
                  />
                </div>
              </div>
            </FormSection>

            {/* ======================================================
                DIGITAL PRODUCT
            ====================================================== */}

            {formData.productType === "digital" && (
              <FormSection
                number="03"
                title="Digital Product"
                description="Attach the downloadable file customers will receive."
              >
                <div className="bg-[#0b0d10] border border-blue-500/10 rounded-xl p-5">
                  {formData.fileKey ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          ✓
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-emerald-300">
                            Digital file uploaded
                          </p>

                          <p className="text-xs text-gray-600 break-all mt-1">
                            {formData.fileKey}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              fileKey: "",
                            }))
                          }
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      {/\.(mp3|wav|m4a|ogg)$/i.test(
                        formData.fileKey
                      ) && (
                        <audio
                          controls
                          className="w-full"
                          src={formData.fileKey}
                        >
                          Your browser does not support audio playback.
                        </audio>
                      )}
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border border-dashed border-blue-500/20 hover:border-blue-400/40 rounded-xl p-7 text-center transition">
                        <div className="text-3xl mb-3">🎵</div>

                        <p className="font-semibold text-gray-200">
                          {uploading && uploadType === "file"
                            ? "Uploading digital file..."
                            : "Upload digital file"}
                        </p>

                        <p className="text-xs text-gray-600 mt-2">
                          MP3, WAV, ZIP, PDF or MP4 · Max 50MB
                        </p>
                      </div>

                      <input
                        type="file"
                        accept=".mp3,.wav,.zip,.pdf,.mp4"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <FormField label="Stripe Price ID">
                  <input
                    type="text"
                    name="priceId"
                    value={formData.priceId}
                    onChange={handleInputChange}
                    placeholder="price_xxxxx (optional)"
                    className="input"
                  />

                  <p className="text-xs text-gray-600 mt-2">
                    Leave empty if your backend automatically creates
                    the Stripe price.
                  </p>
                </FormField>
              </FormSection>
            )}

            {/* ======================================================
                TAGS
            ====================================================== */}

            <FormSection
              number={formData.productType === "digital" ? "04" : "03"}
              title="Discovery"
              description="Add tags to help organize and surface products."
            >
              <FormField label="Tags">
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="music, original, exclusive"
                  className="input"
                />

                <p className="text-xs text-gray-600 mt-2">
                  Separate tags with commas.
                </p>
              </FormField>
            </FormSection>

            {/* ======================================================
                ACTIONS
            ====================================================== */}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.06] text-gray-300 font-semibold transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 px-5 py-3.5 rounded-xl bg-[#607b93] hover:bg-[#6f8da8] text-white font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editingId ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================
          PRODUCTS
      ========================================================== */}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">
              Your Products
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"} in
              your catalog
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadProducts();
              loadStats();
            }}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.06] text-gray-400 hover:text-white transition"
            title="Refresh"
          >
            ↻
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#101318] py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-5">
              📦
            </div>

            <h4 className="text-lg font-bold">
              Your catalog is empty
            </h4>

            <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">
              Create your first product to start building your store
              catalog.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-6 px-5 py-3 rounded-xl bg-[#607b93] hover:bg-[#6f8da8] text-white font-bold transition"
            >
              + Create First Product
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==========================================================
          INLINE STYLES
      ========================================================== */}

      <style>{`
        .input {
          width: 100%;
          background: #0b0d10;
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          border-radius: 0.75rem;
          padding: 0.8rem 1rem;
          outline: none;
          transition: all 150ms ease;
        }

        .input::placeholder {
          color: #4b5563;
        }

        .input:focus {
          border-color: rgba(169,208,222,0.5);
          box-shadow: 0 0 0 3px rgba(169,208,222,0.06);
        }

        .input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        select.input {
          appearance: auto;
        }

        textarea.input {
          line-height: 1.6;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// STAT CARD
// ============================================================================

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#111419] border border-white/[0.07] rounded-2xl p-4 sm:p-5 hover:border-white/[0.12] transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {label}
          </p>

          <p className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
            {value ?? 0}
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FORM SECTION
// ============================================================================

function FormSection({ number, title, description, children }) {
  return (
    <section className="space-y-5">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#607b93]/10 border border-[#607b93]/20 text-[#a9d0de] flex items-center justify-center text-xs font-bold shrink-0">
          {number}
        </div>

        <div>
          <h4 className="font-bold text-lg">
            {title}
          </h4>

          <p className="text-sm text-gray-600 mt-0.5">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// FORM FIELD
// ============================================================================

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}

        {required && (
          <span className="text-[#a9d0de] ml-1">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

// ============================================================================
// PRODUCT CARD
// ============================================================================

function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
}) {
  const isDigital = product.productType === "digital";

  return (
    <article className="bg-[#111419] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl overflow-hidden transition-all">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Image */}
          <div className="w-full sm:w-36 lg:w-40 shrink-0">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#0b0d10] border border-white/[0.06]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-3xl">
                  {isDigital ? "🎵" : "📦"}
                </div>
              )}
            </div>

            {isDigital && product.fileKey && (
              <div className="mt-3">
                {/\.(mp3|wav|m4a|ogg)$/i.test(
                  product.fileKey
                ) ? (
                  <audio
                    controls
                    className="w-full h-8"
                    src={product.fileKey}
                  />
                ) : (
                  <div className="text-[11px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-2 py-1.5 text-center">
                    ✓ Digital file
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-400">
                    {isDigital ? "Digital" : "Physical"}
                  </span>

                  {product.category && (
                    <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-[#607b93]/10 text-[#a9d0de]">
                      {product.category}
                    </span>
                  )}

                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                      product.visible
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-gray-600"
                    }`}
                  >
                    {product.visible ? "● Live" : "○ Hidden"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white truncate">
                  {product.title}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="lg:text-right shrink-0">
                <p className="text-2xl font-bold text-[#a9d0de]">
                  ${(product.price / 100).toFixed(2)}
                </p>

                <p className="text-[11px] text-gray-600 mt-1">
                  Product price
                </p>
              </div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="text-[11px] px-2 py-1 rounded-md bg-white/[0.035] border border-white/[0.05] text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/[0.05]">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-semibold transition"
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onToggleVisibility(
                    product._id,
                    product.visible
                  )
                }
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  product.visible
                    ? "bg-white/5 hover:bg-white/10 text-gray-300"
                    : "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400"
                }`}
              >
                {product.visible ? "👁 Hide" : "👁 Show"}
              </button>

              <button
                type="button"
                onClick={() => onDelete(product._id)}
                className="px-3.5 py-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-sm font-semibold transition sm:ml-auto"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default AdminProductManager;


