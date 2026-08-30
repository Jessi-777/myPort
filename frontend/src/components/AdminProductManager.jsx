import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

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
  printifyProductId: "",
  printifyShopId: "",
};

const CATEGORY_OPTIONS = [
  { value: "Music", label: "🎵 Music" },
  { value: "Art", label: "🎨 Art" },
  { value: "Film", label: "🎬 Film" },
  { value: "Fashion", label: "👕 Fashion" },
  { value: "Original", label: "⭐ Original Piece" },
  { value: "Other", label: "📦 Other" },
];

const DIGITAL_EXTENSIONS =
  ".mp3,.wav,.m4a,.ogg,.zip,.pdf,.mp4";

function getToken() {
  return localStorage.getItem("adminToken");
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| PRICE
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| The admin form works in DOLLARS.
|
| User enters:
|   22.00
|
| Frontend sends:
|   22.00
|
| Backend converts:
|   22.00 -> 2200 cents
|
| MongoDB stores:
|   2200
|
| We DO NOT convert dollars to cents here.
|
|--------------------------------------------------------------------------
*/

function validatePrice(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

function centsToDollars(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "";
  }

  return (number / 100).toFixed(2);
}

export default function AdminProductManager() {
  const [products, setProducts] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    digital: 0,
    physical: 0,
    visible: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(editingId);
  const isDigital = formData.productType === "digital";
  const isPhysical = formData.productType === "physical";

  const authHeaders = useMemo(() => {
    const token = getToken();

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  }, []);

  const clearMessages = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
  }, []);

  const handleUnauthorized = useCallback((errorObject) => {
    if (errorObject?.response?.status === 401) {
      localStorage.removeItem("adminToken");

      setError(
        "Your admin session has expired. Please log in again."
      );

      return true;
    }

    return false;
  }, []);

  const loadProducts = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setProducts([]);
      setLoading(false);
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API}/api/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.products || [];

      setProducts(data);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to load products."
          )
        );
      }

      setProducts([]);
    }
  }, [handleUnauthorized]);

  const loadStats = useCallback(async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await axios.get(
        `${API}/api/admin/products/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || {};

      setStats({
        total: Number(data.total) || 0,
        digital: Number(data.digital) || 0,
        physical: Number(data.physical) || 0,
        visible: Number(data.visible) || 0,
      });
    } catch (err) {
      console.error(
        "Failed to load product stats:",
        err
      );

      if (handleUnauthorized(err)) {
        return;
      }

      setStats({
        total: 0,
        digital: 0,
        physical: 0,
        visible: 0,
      });
    }
  }, [handleUnauthorized]);

  const refresh = useCallback(async () => {
    await Promise.all([
      loadProducts(),
      loadStats(),
    ]);
  }, [loadProducts, loadStats]);

  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      if (!mounted) {
        return;
      }

      setLoading(true);

      try {
        await refresh();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialLoad();

    return () => {
      mounted = false;
    };
  }, [refresh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    clearMessages();
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    clearMessages();
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (product) => {
    clearMessages();

    setFormData({
      title: product.title || "",
      description: product.description || "",
      productType: product.productType || "digital",

      /*
       * Database stores cents.
       * Form displays dollars.
       *
       * 2200 -> 22.00
       */
      price: centsToDollars(product.price),

      imageUrl: product.imageUrl || "",
      priceId: product.priceId || "",
      fileKey: product.fileKey || "",
      category: product.category || "",
      tags: Array.isArray(product.tags)
        ? product.tags.join(", ")
        : product.tags || "",
      printifyProductId:
        product.printifyProductId || "",
      printifyShopId:
        product.printifyShopId || "",
    });

    setEditingId(product._id);
    setShowForm(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Product images must be 5MB or smaller."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    setUploadingImage(true);
    clearMessages();

    try {
      const reader = new FileReader();

      const dataUrl = await new Promise(
        (resolve, reject) => {
          reader.onload = () =>
            resolve(reader.result);

          reader.onerror = () =>
            reject(
              new Error("Failed to read image.")
            );

          reader.readAsDataURL(file);
        }
      );

      const response = await axios.post(
        `${API}/api/admin/upload-image`,
        {
          image: dataUrl,
          folder: "products",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploadedUrl =
        response.data?.url ||
        response.data?.secure_url ||
        "";

      if (!uploadedUrl) {
        throw new Error(
          "Upload succeeded but no image URL was returned."
        );
      }

      setFormData((previous) => ({
        ...previous,
        imageUrl: uploadedUrl,
      }));

      setMessage(
        "Product image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Image upload error:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to upload product image."
          )
        );
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError(
        "Digital files must be 50MB or smaller."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    setUploadingFile(true);
    clearMessages();

    try {
      const reader = new FileReader();

      const dataUrl = await new Promise(
        (resolve, reject) => {
          reader.onload = () =>
            resolve(reader.result);

          reader.onerror = () =>
            reject(
              new Error("Failed to read file.")
            );

          reader.readAsDataURL(file);
        }
      );

      const response = await axios.post(
        `${API}/api/admin/upload-file`,
        {
          file: dataUrl,
          folder: "digital-files",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const uploadedUrl =
        response.data?.url ||
        response.data?.secure_url ||
        "";

      if (!uploadedUrl) {
        throw new Error(
          "Upload succeeded but no file URL was returned."
        );
      }

      setFormData((previous) => ({
        ...previous,
        fileKey: uploadedUrl,
      }));

      const sizeText = response.data?.bytes
        ? ` (${(
            response.data.bytes /
            1024 /
            1024
          ).toFixed(2)} MB)`
        : "";

      setMessage(
        `Digital file uploaded successfully${sizeText}.`
      );
    } catch (err) {
      console.error(
        "Digital file upload error:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to upload digital file."
          )
        );
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const title = formData.title.trim();
    const description =
      formData.description.trim();
    const category = formData.category.trim();

    if (!title) {
      setError("Product title is required.");
      return;
    }

    if (!category) {
      setError(
        "Please select a product category."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Keep price in DOLLARS here.
     *
     * $22.00 -> 22
     *
     * The backend performs the ONLY cents conversion.
     */
    const price = validatePrice(formData.price);

    if (price === null) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      isDigital &&
      !formData.fileKey.trim()
    ) {
      setError(
        "Digital products need a digital file or file URL."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        description,
        productType: formData.productType,

        /*
         * SEND DOLLARS.
         *
         * 22.00 stays 22.00.
         */
        price,

        imageUrl:
          formData.imageUrl.trim(),

        priceId:
          formData.priceId.trim(),

        fileKey:
          formData.fileKey.trim(),

        category,

        tags: normalizeTags(
          formData.tags
        ),

        printifyProductId:
          formData.printifyProductId.trim(),

        printifyShopId:
          formData.printifyShopId.trim(),
      };

      let response;

      if (editingId) {
        response = await axios.put(
          `${API}/api/admin/products/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${API}/api/admin/products`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setMessage(
        response.data?.message ||
          (editingId
            ? "Product updated successfully."
            : "Product created successfully.")
      );

      resetForm();
      setShowForm(false);

      await refresh();
    } catch (err) {
      console.error(
        "Product save error:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to save product."
          )
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      return;
    }

    const product = products.find(
      (item) => item._id === id
    );

    const confirmed = window.confirm(
      `Delete "${
        product?.title || "this product"
      }"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    clearMessages();

    try {
      await axios.delete(
        `${API}/api/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Product deleted successfully."
      );

      await refresh();
    } catch (err) {
      console.error(
        "Product delete error:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to delete product."
          )
        );
      }
    }
  };

  const handleToggleVisibility = async (
    id,
    currentVisible
  ) => {
    const token = getToken();

    if (!token) {
      setError(
        "No admin token found. Please log in again."
      );
      return;
    }

    clearMessages();

    try {
      const response = await axios.patch(
        `${API}/api/admin/products/${id}/toggle-visibility`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data?.message ||
          `Product ${
            currentVisible
              ? "hidden"
              : "shown"
          } successfully.`
      );

      await Promise.all([
        loadProducts(),
        loadStats(),
      ]);
    } catch (err) {
      console.error(
        "Product visibility error:",
        err
      );

      if (!handleUnauthorized(err)) {
        setError(
          getErrorMessage(
            err,
            "Failed to change product visibility."
          )
        );
      }
    }
  };

  const formatPrice = (price) => {
    const cents = Number(price) || 0;

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(cents / 100);
  };

  const visibleProducts =
    products.filter(
      (product) =>
        product.visible !== false
    ).length;

  const displayedStats = {
    total:
      Number(stats.total) ||
      products.length ||
      0,

    digital:
      Number(stats.digital) ||
      products.filter(
        (product) =>
          product.productType ===
          "digital"
      ).length,

    physical:
      Number(stats.physical) ||
      products.filter(
        (product) =>
          product.productType ===
          "physical"
      ).length,

    visible:
      Number(stats.visible) ||
      visibleProducts,
  };

  if (loading) {
    return (
      <div className="min-h-[500px] bg-[#1f2227] flex items-center justify-center rounded-2xl">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-white" />

          <p className="text-lg font-semibold">
            Loading products...
          </p>

          <p className="mt-1 text-sm text-white/40">
            Connecting to your product catalog
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1f2227] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#81b5c5]">
              Tica's Founders Shop Administration
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Product Manager
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              In this vault we create and manage digital products, physical products,
              downloads, Printify products, pricing, images and storefront visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={
              showForm
                ? closeForm
                : openCreateForm
            }
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/90"
          >
            {showForm
              ? "Cancel"
              : "+ Add Product"}
          </button>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            <span className="text-lg">
              ✓
            </span>

            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            <span className="text-lg">
              !
            </span>

            <p>{error}</p>
          </div>
        )}

        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Products"
            value={displayedStats.total}
            icon="📦"
          />

          <StatCard
            label="Digital"
            value={displayedStats.digital}
            icon="📥"
          />

          <StatCard
            label="Physical"
            value={displayedStats.physical}
            icon="🛍️"
          />

          <StatCard
            label="Visible"
            value={displayedStats.visible}
            icon="◉"
          />
        </div>

        {/* FORM */}
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f10] shadow-2xl">

            <div className="border-b border-white/10 bg-white/[0.025] px-5 py-5 sm:px-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#81b5c5]">
                {isEditing
                  ? "Edit existing product"
                  : "New catalog item"}
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {isEditing
                  ? "Edit Product"
                  : "Create Product"}
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-5 sm:p-7"
            >

              {/* BASIC INFORMATION */}
              <div>
                <SectionHeading>
                  Product Information
                </SectionHeading>

                <div className="grid gap-5 lg:grid-cols-2">

                  <Field
                    label="Product Title"
                    required
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={
                        handleInputChange
                      }
                      placeholder="e.g. Tu Mochi — Digital Single"
                      required
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Product Type"
                    required
                  >
                    <select
                      name="productType"
                      value={
                        formData.productType
                      }
                      onChange={
                        handleInputChange
                      }
                      disabled={isEditing}
                      className={inputClass}
                    >
                      <option value="digital">
                        📥 Digital Product
                      </option>

                      <option value="physical">
                        🛍️ Physical Product
                      </option>
                    </select>

                    {isEditing && (
                      <p className="mt-2 text-xs text-white/35">
                        Product type cannot be changed after creation.
                      </p>
                    )}
                  </Field>

                  <Field
                    label="Price"
                    required
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
                        $
                      </span>

                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={
                          handleInputChange
                        }
                        min="0"
                        step="0.01"
                        placeholder="19.99"
                        required
                        className={`${inputClass} pl-8`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-white/35">
                      Enter 0.00 for a free product.
                    </p>
                  </Field>

                  <Field
                    label="Category"
                    required
                  >
                    <select
                      name="category"
                      value={formData.category}
                      onChange={
                        handleInputChange
                      }
                      required
                      className={inputClass}
                    >
                      <option value="">
                        Select category...
                      </option>

                      {CATEGORY_OPTIONS.map(
                        (category) => (
                          <option
                            key={
                              category.value
                            }
                            value={
                              category.value
                            }
                          >
                            {category.label}
                          </option>
                        )
                      )}
                    </select>
                  </Field>

                  <div className="lg:col-span-2">
                    <Field label="Description">
                      <textarea
                        name="description"
                        value={
                          formData.description
                        }
                        onChange={
                          handleInputChange
                        }
                        rows={5}
                        placeholder="Describe the product, what the customer receives, features, format, etc."
                        className={`${inputClass} resize-y`}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <SectionHeading>
                  Product Image
                </SectionHeading>

                <div className="grid gap-5 lg:grid-cols-[220px_1fr]">

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    {formData.imageUrl ? (
                      <div className="relative aspect-square">
                        <img
                          src={
                            formData.imageUrl
                          }
                          alt="Product preview"
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setFormData(
                              (previous) => ({
                                ...previous,
                                imageUrl:
                                  "",
                              })
                            )
                          }
                          className="absolute right-2 top-2 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-bold text-white hover:bg-black"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex aspect-square flex-col items-center justify-center p-5 text-center text-white/25">
                        <span className="text-4xl">
                          🖼️
                        </span>

                        <span className="mt-2 text-xs">
                          No image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Field label="Image URL">
                      <input
                        type="url"
                        name="imageUrl"
                        value={
                          formData.imageUrl
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </Field>

                    <div className="flex flex-wrap gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]">
                        {uploadingImage
                          ? "Uploading..."
                          : "📤 Upload Image"}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleImageUpload
                          }
                          disabled={
                            uploadingImage
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    <p className="text-xs leading-5 text-white/35">
                      JPG, PNG, WebP and other browser-supported
                      image formats. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* DIGITAL */}
              {isDigital && (
                <div>
                  <SectionHeading>
                    Digital Product
                  </SectionHeading>

                  <div className="space-y-5">

                    <Field
                      label="Digital File"
                      required
                    >
                      {formData.fileKey && (
                        <div className="mb-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                                File Attached
                              </p>

                              <p className="mt-1 truncate text-sm text-white/60">
                                {formData.fileKey}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setFormData(
                                  (
                                    previous
                                  ) => ({
                                    ...previous,
                                    fileKey:
                                      "",
                                  })
                                )
                              }
                              className="shrink-0 text-xs font-bold text-red-300 hover:text-red-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.025] px-5 py-6 text-center transition hover:border-white/30 hover:bg-white/[0.05]">
                        <div>
                          <div className="text-2xl">
                            {uploadingFile
                              ? "⏳"
                              : "📤"}
                          </div>

                          <p className="mt-2 text-sm font-bold">
                            {uploadingFile
                              ? "Uploading digital file..."
                              : formData.fileKey
                                ? "Replace digital file"
                                : "Upload digital file"}
                          </p>

                          <p className="mt-1 text-xs text-white/35">
                            MP3, WAV, M4A, OGG, ZIP, PDF or MP4 • Max 50MB
                          </p>
                        </div>

                        <input
                          type="file"
                          accept={
                            DIGITAL_EXTENSIONS
                          }
                          onChange={
                            handleFileUpload
                          }
                          disabled={
                            uploadingFile
                          }
                          className="hidden"
                        />
                      </label>

                      <div className="mt-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
                          Or enter a file URL
                        </p>

                        <input
                          type="url"
                          name="fileKey"
                          value={
                            formData.fileKey
                          }
                          onChange={
                            handleInputChange
                          }
                          placeholder="https://..."
                          className={inputClass}
                        />
                      </div>
                    </Field>

                    <Field label="Stripe Price ID">
                      <input
                        type="text"
                        name="priceId"
                        value={
                          formData.priceId
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="price_xxxxxxxxxxxxx"
                        className={inputClass}
                      />

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        Keep the Stripe Price ID here when your checkout
                        uses Stripe price IDs.
                      </p>
                    </Field>
                  </div>
                </div>
              )}

              {/* PHYSICAL */}
              {isPhysical && (
                <div>
                  <SectionHeading>
                    Physical Product / Printify
                  </SectionHeading>

                  <div className="grid gap-5 lg:grid-cols-2">

                    <Field label="Printify Product ID">
                      <input
                        type="text"
                        name="printifyProductId"
                        value={
                          formData.printifyProductId
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Printify product ID"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Printify Shop ID">
                      <input
                        type="text"
                        name="printifyShopId"
                        value={
                          formData.printifyShopId
                        }
                        onChange={
                          handleInputChange
                        }
                        placeholder="Printify shop ID"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4 rounded-xl border border-indigo-400/15 bg-indigo-400/5 p-4">
                    <p className="text-sm font-bold text-indigo-200">
                      Printify-ready
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      These fields are optional. A physical product can
                      still be registered normally without Printify IDs.
                    </p>
                  </div>
                </div>
              )}

              {/* TAGS */}
              <div>
                <SectionHeading>
                  Discovery & Organization
                </SectionHeading>

                <Field label="Tags">
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={
                      handleInputChange
                    }
                    placeholder="music, original, exclusive, digital"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-white/35">
                    Separate multiple tags with commas.
                  </p>
                </Field>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/70 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage ||
                    uploadingFile
                  }
                  className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving Product..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRODUCTS */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                Product Catalog
              </h2>

              <p className="mt-1 text-sm text-white/35">
                {products.length} product
                {products.length === 1
                  ? ""
                  : "s"} registered
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0e0f10] p-12 text-center">
              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-4 text-xl font-black">
                No products yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Create your first digital or physical product
                to start building your catalog.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90"
              >
                + Create First Product
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              {products.map((product) => {
                const visible =
                  product.visible !== false;

                const productTags =
                  Array.isArray(
                    product.tags
                  )
                    ? product.tags
                    : [];

                return (
                  <article
                    key={product._id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f10] transition hover:border-white/20"
                  >
                    <div className="flex flex-col gap-5 p-5 md:flex-row">

                      {/* PRODUCT IMAGE */}
                      <div className="w-full shrink-0 md:w-48">
                        <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/30">

                          {product.imageUrl ? (
                            <img
                              src={
                                product.imageUrl
                              }
                              alt={
                                product.title ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-5xl opacity-20">
                              {product.productType ===
                              "digital"
                                ? "📥"
                                : "🛍️"}
                            </div>
                          )}
                        </div>

                        {product.productType ===
                          "digital" &&
                          product.fileKey && (
                            <audio
                              controls
                              preload="none"
                              className="mt-3 w-full"
                            >
                              <source
                                src={
                                  product.fileKey
                                }
                              />

                              Your browser does not support audio playback.
                            </audio>
                          )}
                      </div>

                      {/* DETAILS */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                  product.productType ===
                                  "digital"
                                    ? "bg-indigo-400/10 text-indigo-300"
                                    : "bg-purple-400/10 text-purple-300"
                                }`}
                              >
                                {product.productType ===
                                "digital"
                                  ? "Digital"
                                  : "Physical"}
                              </span>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                  visible
                                    ? "bg-emerald-400/10 text-emerald-300"
                                    : "bg-white/5 text-white/35"
                                }`}
                              >
                                {visible
                                  ? "Visible"
                                  : "Hidden"}
                              </span>
                            </div>

                            <h3 className="mt-3 text-2xl font-black tracking-tight">
                              {product.title}
                            </h3>

                            {product.category && (
                              <p className="mt-1 text-sm text-white/40">
                                {
                                  product.category
                                }
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p className="text-2xl font-black text-white">
                              {formatPrice(
                                product.price
                              )}
                            </p>

                            {product.price ===
                              0 && (
                              <p className="text-xs font-bold text-emerald-300">
                                Free product
                              </p>
                            )}
                          </div>
                        </div>

                        {product.description && (
                          <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-white/55">
                            {
                              product.description
                            }
                          </p>
                        )}

                        {productTags.length >
                          0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {productTags.map(
                              (
                                tag,
                                index
                              ) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/50"
                                >
                                  #{tag}
                                </span>
                              )
                            )}
                          </div>
                        )}

                        {(product.priceId ||
                          product.printifyProductId ||
                          product.printifyShopId ||
                          product.fileKey) && (
                          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

                            {product.priceId && (
                              <InfoPill
                                label="Stripe"
                                value={
                                  product.priceId
                                }
                              />
                            )}

                            {product.fileKey && (
                              <InfoPill
                                label="Digital File"
                                value="Attached"
                              />
                            )}

                            {product.printifyProductId && (
                              <InfoPill
                                label="Printify Product"
                                value={
                                  product.printifyProductId
                                }
                              />
                            )}

                            {product.printifyShopId && (
                              <InfoPill
                                label="Printify Shop"
                                value={
                                  product.printifyShopId
                                }
                              />
                            )}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleVisibility(
                                product._id,
                                visible
                              )
                            }
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08]"
                          >
                            {visible
                              ? "🙈 Hide"
                              : "👁️ Show"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                            className="rounded-lg border border-red-400/15 bg-red-400/5 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-indigo-400/60 focus:bg-black/40";

function Field({
  label,
  required = false,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/45">
        {label}

        {required && (
          <span className="ml-1 text-[#81b5c5]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white/70">
        {children}
      </h3>

      <div className="mt-3 h-px bg-white/10" />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e0f10] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-white/35">
          {label}
        </p>

        <span className="text-lg opacity-60">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

function InfoPill({
  label,
  value,
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-1 truncate text-xs text-white/50">
        {value}
      </p>
    </div>
  );
}