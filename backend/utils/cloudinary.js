const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

module.exports = cloudinary;
