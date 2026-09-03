const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Body parsers with size limit to prevent payload abuse
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")));

// ─── Production: serve Vite build ───────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  // On Vercel: frontend/dist (outputDirectory). On Render: dist (after mv)
  const frontendBuildPath = process.env.VERCEL
    ? path.join(path.resolve(), "frontend", "dist")
    : path.join(path.resolve(), "dist");

  app.use(express.static(frontendBuildPath));

  // All non-API routes → React SPA
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendBuildPath, "index.html"));
  });
}

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  const server = app.listen(port, () =>
    console.log(`Server running on port: ${port}`)
  );
}

// Graceful shutdown on Render / process signals
if (!process.env.VERCEL) {
  process.on("SIGTERM", () => {
    console.log("SIGTERM received — shutting down gracefully");
    if (typeof server !== 'undefined' && server) {
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}

// Export for Vercel
module.exports = app;
