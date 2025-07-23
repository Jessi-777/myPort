const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  genre: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Music', musicSchema);