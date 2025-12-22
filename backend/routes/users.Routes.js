const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const auth = require("../middleware/adminAuth"); //  protected routes

const router = express.Router();

// ---------------------------
// Generate JWT Token
// ---------------------------
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ---------------------------
// REGISTER USER
// ---------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
    });

    return res.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token: generateToken(newUser._id),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// LOGIN USER
// ---------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// GET USER PROFILE (Protected)
// ---------------------------
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// UPDATE USER (Protected)
// ---------------------------
router.put("/update", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    return res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
