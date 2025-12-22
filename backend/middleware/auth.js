const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    // Expected format: "Bearer <token>"
    const token = header.startsWith("Bearer ")
      ? header.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    // Verify normal user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach essential user data to request
    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
