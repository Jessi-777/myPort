// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load local .env only for development
dotenv.config({ path: path.resolve(__dirname, ".env") });

const stripeWebhook = require("./webhook/stripeWebhook");
const checkoutRoutes = require("./routes/checkout");
const downloadRoutes = require("./routes/downloads");
const adminRoutes = require("./routes/admin");
const adminProductsRoutes = require("./routes/adminProducts");
const productsPublic = require("./routes/productsPublic");
const usersRoutes = require("./routes/users.Routes");
const printifyRoutes = require("./routes/printify");

const app = express();

/* ================================
   🔥 STRIPE WEBHOOK — MUST BE FIRST
================================ */
let stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null;
const stripeSecretPath = "/etc/secrets/STRIPE_WEBHOOK_SECRET";

if (fs.existsSync(stripeSecretPath)) {
  stripeWebhookSecret = fs.readFileSync(stripeSecretPath, "utf8").trim();
}

if (!stripeWebhookSecret) {
  console.warn("⚠️ STRIPE_WEBHOOK_SECRET not defined. Webhook may fail.");
}

app.use(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/* ================================
   🌍 CORS
================================ */
const clientUrl = process.env.CLIENT_URL;
if (!clientUrl) console.warn("⚠️ CLIENT_URL not defined in env");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
  clientUrl
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================================
   🧠 JSON PARSER
================================ */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ================================
   🚀 ROUTES
================================ */
app.use("/api/checkout", checkoutRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/products", productsPublic);
app.use("/api/users", usersRoutes);
app.use("/api/printify", printifyRoutes);

/* ================================
   🗄️ DATABASE + SERVER
================================ */
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/localdb";

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI not defined!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

/* ================================
   🔥 Error Handling
================================ */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});





// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const path = require("path");

// dotenv.config({ path: path.resolve(__dirname, ".env") });

// const stripeWebhook = require("./webhook/stripeWebhook");
// const checkoutRoutes = require("./routes/checkout");
// const downloadRoutes = require("./routes/downloads");
// const adminRoutes = require("./routes/admin");
// const adminProductsRoutes = require("./routes/adminProducts");
// const productsPublic = require("./routes/productsPublic");
// const usersRoutes = require("./routes/users.Routes");
// const printifyRoutes = require("./routes/printify");

// const app = express();

// /* ================================
//    🔥 STRIPE WEBHOOK — MUST BE FIRST
// ================================ */
// app.use(
//   "/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );

// /* ================================
//    🌍 CORS
// ================================ */
// const clientUrl = process.env.CLIENT_URL;
// if (!clientUrl) console.warn("⚠️ CLIENT_URL not defined in env");

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5175",
//   "http://localhost:5176",
//   "http://127.0.0.1:5173",
//   "http://127.0.0.1:5174",
//   "http://127.0.0.1:5175",
//   "http://127.0.0.1:5176",
//   clientUrl
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       console.log("❌ CORS blocked:", origin);
//       callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// /* ================================
//    🧠 JSON PARSER
// ================================ */
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// /* ================================
//    🚀 ROUTES
// ================================ */
// app.use("/api/checkout", checkoutRoutes);
// app.use("/api/downloads", downloadRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/products", adminProductsRoutes);
// app.use("/api/products", productsPublic);
// app.use("/api/users", usersRoutes);
// app.use("/api/printify", printifyRoutes);

// /* ================================
//    🗄️ DATABASE + SERVER
// ================================ */
// const PORT = process.env.PORT || 5001;

// if (!process.env.MONGODB_URI) {
//   console.error("❌ MONGODB_URI not defined!");
//   process.exit(1); // exit early if no DB URI
// }

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✓ MongoDB connected");
//     app.listen(PORT, () =>
//       console.log(`🚀 Backend running on port ${PORT}`)
//     );
//   })
//   .catch((err) => console.error("MongoDB error:", err));

// /* ================================
//    🔥 Error Handling
// ================================ */
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });







  

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const path = require("path");

// dotenv.config({ path: path.resolve(__dirname, ".env") });

// const url ="https://myport-7kfa.onrender.com"

// const stripeWebhook = require("./webhook/stripeWebhook");
// const checkoutRoutes = require("./routes/checkout");
// const downloadRoutes = require("./routes/downloads");
// const adminRoutes = require("./routes/admin");
// const adminProductsRoutes = require("./routes/adminProducts");
// const productsPublic = require("./routes/productsPublic");
// const usersRoutes = require("./routes/users.Routes");
// const printifyRoutes = require("./routes/printify");

// const app = express();

// /* ================================
//    🔥 STRIPE WEBHOOK — MUST BE FIRST
// ================================ */
// app.use(
//   "/webhook/stripe",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );

// // ================================
//   //  🌍 CORS 
//    "http://localhost:5173" ; "https://myport-7kfa.onrender.com"// local dev

//    // ================================
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "http://localhost:5175",
//     "http://localhost:5176",
//     "http://127.0.0.1:5173",
//     "http://127.0.0.1:5174",
//     "http://127.0.0.1:5175",
//     "http://127.0.0.1:5176"
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// /* ================================
//    🧠 JSON PARSER (50MB limit for image uploads)
// ================================ */
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// /* ================================
//    🚀 ROUTES
// ================================ */
// app.use("/api/checkout", checkoutRoutes);
// app.use("/api/downloads", downloadRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/products", adminProductsRoutes);
// app.use("/api/products", productsPublic);
// app.use("/api/users", usersRoutes);
// app.use("/api/printify", printifyRoutes);

// /* ================================
//    🗄️ DATABASE + SERVER
// ================================ */
// const PORT = process.env.PORT || 5001;

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✓ MongoDB connected");
//     app.listen(PORT, () =>
//       console.log("🚀 Backend running on port", PORT)
//     );
//   })
//   .catch((err) => console.error("MongoDB error:", err));
