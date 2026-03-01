// routes/emailCapture.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  // Save to MongoDB or send to email platform
  console.log("Captured email:", email);

  res.json({ success: true });
});

module.exports = router;