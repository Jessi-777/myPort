const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String },
  duration: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Film', filmSchema);