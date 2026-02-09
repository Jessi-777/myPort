const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const url ="https://myport-7kfa.onrender.com"


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
app.use(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ================================
  //  🌍 CORS 
   "http://localhost:5173" ; "https://myport-7kfa.onrender.com"// local dev
// ================================
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* ================================
   🧠 JSON PARSER (50MB limit for image uploads)
================================ */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () =>
      console.log("🚀 Backend running on port", PORT)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));






// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// dotenv.config();

// const stripeWebhook = require("./webhook/stripeWebhook");
// const checkoutRoutes = require("./routes/checkout");
// const downloadRoutes = require("./routes/downloads");
// const adminRoutes = require("./routes/admin");
// const productsPublic = require("./routes/productsPublic");
// const usersRoutes = require("./routes/users.Routes");

// const app = express();

// // CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.options("/*", cors());

// // Stripe webhook first
// app.use("/webhook/stripe", stripeWebhook);

// // JSON parser
// app.use(express.json());

// // ROUTES
// app.use("/api/checkout", checkoutRoutes);
// app.use("/api/downloads", downloadRoutes);
// app.use("/api/admin", adminRoutes);       // This already includes /products CRUD
// app.use("/api/products", productsPublic);
// app.use("/api/users", usersRoutes);

// // MongoDB + Start Server
// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✓ MongoDB connected");
//     app.listen(PORT, () =>
//       console.log("🚀 Backend running on port", PORT)
//     );
//   })
//   .catch((err) => console.error("MongoDB error:", err));





// // index.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// dotenv.config();

// const stripeWebhook = require("./webhook/stripeWebhook");
// const checkoutRoutes = require("./routes/checkout");
// const downloadRoutes = require("./routes/downloads");
// const adminRoutes = require("./routes/admin");
// const productsPublic = require("./routes/productsPublic");
// const usersRoutes = require("./routes/users.Routes");


// const app = express();

// // ------------------------------
// // 1) CORS MUST be first
// // ------------------------------
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.options("*", cors());

// // ------------------------------
// // 2) Stripe webhook must be raw
// // ------------------------------
// app.use("/webhook/stripe", stripeWebhook);


// // ------------------------------
// // 3) JSON parser - AFTER Stripe
// // ------------------------------
// app.use(express.json());

// // ------------------------------
// // 4) Routes
// // ------------------------------
// app.use("/api/checkout", checkoutRoutes);
// app.use("/api/downloads", downloadRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/products", productsPublic);
// app.use('/api/users', usersRoutes)


// // ------------------------------
// // 5) Mongo + Start Server
// // ------------------------------
// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✓ MongoDB connected");
//     app.listen(PORT, () =>
//       console.log("🚀 Backend running on port", PORT)
//     );
//   })
//   .catch((err) => console.error("MongoDB error:", err));


//   // module.exports = router;
