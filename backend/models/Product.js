const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },              // New: optional image
  category: { type: String },              // New: optional category
  inStock: { type: Boolean, default: true } // New: availability flag
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
