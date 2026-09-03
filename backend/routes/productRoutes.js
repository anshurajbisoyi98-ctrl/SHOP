const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();

const {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} = require("../controllers/productController.js");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware.js");
const checkId = require("../middlewares/checkId.js");

// ─── Static routes MUST come before /:id to avoid Express matching them as IDs ──
router.get("/allproducts", fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.post("/filtered-products", filterProducts);

// ─── Root route ───────────────────────────────────────────────────────────────
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

// ─── Reviews ─────────────────────────────────────────────────────────────────
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// ─── Product by ID (MUST be last) ────────────────────────────────────────────
router
  .route("/:id")
  .get(checkId, fetchProductById)
  .put(authenticate, authorizeAdmin, checkId, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, checkId, removeProduct);

module.exports = router;
