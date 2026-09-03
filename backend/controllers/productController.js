const asyncHandler = require("../middlewares/asyncHandler.js");
const Product = require("../models/productModel.js");

// Helper: escape special regex characters to prevent ReDoS/injection attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation — return proper 400 status with error object
    if (!name) { res.status(400); throw new Error("Name is required"); }
    if (!brand) { res.status(400); throw new Error("Brand is required"); }
    if (!description) { res.status(400); throw new Error("Description is required"); }
    if (!price) { res.status(400); throw new Error("Price is required"); }
    if (!category) { res.status(400); throw new Error("Category is required"); }
    if (!quantity) { res.status(400); throw new Error("Quantity is required"); }

    const product = new Product({ ...req.fields });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(res.statusCode === 200 ? 400 : res.statusCode).json({ message: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    if (!name) { res.status(400); throw new Error("Name is required"); }
    if (!brand) { res.status(400); throw new Error("Brand is required"); }
    if (!description) { res.status(400); throw new Error("Description is required"); }
    if (!price) { res.status(400); throw new Error("Price is required"); }
    if (!category) { res.status(400); throw new Error("Category is required"); }
    if (!quantity) { res.status(400); throw new Error("Quantity is required"); }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(res.statusCode === 200 ? 400 : res.statusCode).json({ message: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product removed", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    // FIX: Escape keyword before using in $regex to prevent ReDoS/injection
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: escapeRegex(req.query.keyword),
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // FIX: was `createAt` (typo) — correct field is `createdAt`
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(res.statusCode === 200 ? 400 : res.statusCode).json({ message: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked && checked.length > 0) args.category = { $in: checked };
    if (radio && radio.length === 2) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
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
};
