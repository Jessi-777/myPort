const Product = require("../models/Product");

// -------------------------------------------
// CREATE PRODUCT
// -------------------------------------------
exports.createProduct = async (req, res) => {
  try {
    const { title, description, priceId, imageUrl, fileKey, visible } = req.body;

    if (!title || !priceId || !fileKey) {
      return res.status(400).json({ error: "title, priceId and fileKey are required" });
    }

    const product = await Product.create({
      title,
      description,
      priceId,
      imageUrl,
      fileKey,
      visible: visible ?? true
    });

    return res.json({ message: "Product created", product });
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------------------
// UPDATE PRODUCT
// -------------------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    return res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------------------
// DELETE PRODUCT
// -------------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Product not found" });

    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------------------
// GET ALL PRODUCTS (admin sees all)
// -------------------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// -------------------------------------------
// GET SINGLE PRODUCT
// -------------------------------------------
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    return res.json(product);
  } catch (err) {
    console.error("Get single product error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
