// adminAuth.js
const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (decoded.role !== "admin") throw new Error("Invalid role");
    req.admin = decoded.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
