const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

/* ---------------------------------------
   ADMIN LOGIN (Single Password → JWT)
---------------------------------------- */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  // Get the admin password from env, trim any whitespace
  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  const inputPassword = (password || "").trim();

  // Debug logging
  console.log("Login attempt with password:", inputPassword);
  console.log("Expected password:", adminPassword);
  console.log("Match:", inputPassword === adminPassword);

  // Simple string comparison (after trimming)
  const valid = inputPassword === adminPassword;

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // create JWT
  const token = jwt.sign(
    { sub: "admin", role: "admin" },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "12h" }
  );

  console.log("✓ Admin login successful");
  return res.json({ token });
});

/* ---------------------------------------
   CLOUDINARY IMAGE UPLOAD
---------------------------------------- */
router.post("/upload-image", adminAuth, async (req, res) => {
  try {
    console.log("📸 IMAGE UPLOAD - Request received");
    const { image, folder = 'products' } = req.body;

    if (!image) {
      console.log("❌ No image data in request");
      return res.status(400).json({ error: "Missing image data" });
    }

    console.log("📤 Uploading to Cloudinary...");
    console.log("   Folder:", `tica-shop/${folder}`);
    console.log("   Image size:", image.length, "bytes (base64)");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: `tica-shop/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log("✅ Image uploaded successfully");
    console.log("   URL:", result.secure_url);
    console.log("   Size:", result.bytes, "bytes");

    return res.json({ 
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    console.error("   Full error:", err);
    return res.status(500).json({ error: "Failed to upload image: " + err.message });
  }
});

/* ---------------------------------------
   CLOUDINARY FILE UPLOAD (Music, Digital Files)
---------------------------------------- */
router.post("/upload-file", adminAuth, async (req, res) => {
  try {
    const { file, folder = 'digital-files' } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Missing file data" });
    }

    // Upload to Cloudinary (supports any file type)
    const result = await cloudinary.uploader.upload(file, {
      folder: `tica-shop/${folder}`,
      resource_type: 'auto', // Allows any file type (audio, video, zip, etc.)
    });

    return res.json({ 
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });
  } catch (err) {
    console.error("Cloudinary file upload error:", err);
    return res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
