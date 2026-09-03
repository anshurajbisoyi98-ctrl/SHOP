const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });

const connectDB = require("./config/db.js");
const Category = require("./models/categoryModel.js");
const Product = require("./models/productModel.js");

const categories = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Footwear" },
  { name: "Accessories" },
  { name: "Home & Kitchen" },
];

// We'll assign category IDs after inserting them
const getProducts = (catMap) => [
  // ── Electronics ──────────────────────────────────────────────
  {
    name: "Apple iPhone 15 Pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
    brand: "Apple",
    quantity: 50,
    category: catMap["Electronics"],
    description:
      "The latest iPhone 15 Pro with A17 Pro chip, titanium design, USB-C, and a 48MP main camera system.",
    price: 999,
    countInStock: 50,
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    image: "https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-s928-sm-s928bztgeub-thumb-539573916",
    brand: "Samsung",
    quantity: 40,
    category: catMap["Electronics"],
    description:
      "Samsung's flagship with 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3 processor.",
    price: 1199,
    countInStock: 40,
    rating: 4.7,
    numReviews: 98,
  },
  {
    name: 'Sony 65" 4K OLED TV',
    image: "https://m.media-amazon.com/images/I/71FTBF2VMDL._AC_SX679_.jpg",
    brand: "Sony",
    quantity: 20,
    category: catMap["Electronics"],
    description:
      "65-inch OLED display with Cognitive Processor XR, Dolby Vision, and Google TV built-in.",
    price: 1799,
    countInStock: 20,
    rating: 4.9,
    numReviews: 56,
  },
  {
    name: "Apple MacBook Air M3",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034",
    brand: "Apple",
    quantity: 30,
    category: catMap["Electronics"],
    description:
      "MacBook Air with Apple M3 chip, 13.6-inch Liquid Retina display, up to 18-hour battery life.",
    price: 1099,
    countInStock: 30,
    rating: 4.9,
    numReviews: 211,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    image: "https://m.media-amazon.com/images/I/61vr5UFUSSL._AC_SX679_.jpg",
    brand: "Sony",
    quantity: 60,
    category: catMap["Electronics"],
    description:
      "Industry-leading noise cancellation headphones with 30-hour battery and multipoint connection.",
    price: 349,
    countInStock: 60,
    rating: 4.8,
    numReviews: 340,
  },

  // ── Clothing ──────────────────────────────────────────────────
  {
    name: "Levi's 501 Original Jeans",
    image: "https://lsco.scene7.com/is/image/lsco/005010194-front-pdp?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,0&op_usm=0.6,0.6,8&wid=500&hei=560",
    brand: "Levi's",
    quantity: 100,
    category: catMap["Clothing"],
    description:
      "The iconic straight-fit jeans in rigid denim. A timeless wardrobe essential since 1873.",
    price: 69,
    countInStock: 100,
    rating: 4.6,
    numReviews: 520,
  },
  {
    name: "Nike Dri-FIT T-Shirt",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99e07a43-b823-4ee7-a3c6-a8a4e1a71e54/dri-fit-uv-hyverse-short-sleeve-versatile-top-3M4TSw.png",
    brand: "Nike",
    quantity: 200,
    category: catMap["Clothing"],
    description:
      "Sweat-wicking Dri-FIT fabric keeps you dry during any workout. Available in multiple colors.",
    price: 35,
    countInStock: 200,
    rating: 4.5,
    numReviews: 890,
  },
  {
    name: "Zara Oversized Blazer",
    image: "https://static.zara.net/assets/public/7f15/6ade/bc814213b618/f08c5e89de20/04378041800-p/04378041800-p.jpg?ts=1704980823744&w=563",
    brand: "Zara",
    quantity: 75,
    category: catMap["Clothing"],
    description:
      "Relaxed-fit structured blazer in a premium blend fabric. Perfect for casual and office wear.",
    price: 89,
    countInStock: 75,
    rating: 4.4,
    numReviews: 130,
  },

  // ── Footwear ──────────────────────────────────────────────────
  {
    name: "Nike Air Max 270",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtppnzmkfqpnqhvg/air-max-270-shoes-2V5C4p.png",
    brand: "Nike",
    quantity: 80,
    category: catMap["Footwear"],
    description:
      "Max Air heel unit delivers all-day comfort. Lightweight mesh upper for breathability.",
    price: 150,
    countInStock: 80,
    rating: 4.7,
    numReviews: 475,
  },
  {
    name: "Adidas Ultraboost 23",
    image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7f5fa04af0c843f5848caeaf01173614_9366/Ultraboost_Light_Running_Shoes_White_HQ6351_01_standard.jpg",
    brand: "Adidas",
    quantity: 65,
    category: catMap["Footwear"],
    description:
      "Responsive Boost midsole and Primeknit upper for an exceptional running experience.",
    price: 190,
    countInStock: 65,
    rating: 4.8,
    numReviews: 310,
  },
  {
    name: "Converse Chuck Taylor All Star",
    image: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dwa52f7dab/images/a_107/M9160_A_107X1.jpg?sw=800",
    brand: "Converse",
    quantity: 120,
    category: catMap["Footwear"],
    description:
      "The original canvas sneaker — a cultural icon for over a century. Unisex fit.",
    price: 65,
    countInStock: 120,
    rating: 4.6,
    numReviews: 1200,
  },

  // ── Accessories ───────────────────────────────────────────────
  {
    name: "Apple Watch Series 9",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO+watch-face-45-aluminum-midnight-9s_VW_34FR?wid=1400&hei=1400&trim=1,0&fmt=p-jpg&qlt=95&.v=1693512899072",
    brand: "Apple",
    quantity: 45,
    category: catMap["Accessories"],
    description:
      "Advanced health features, Always-On Retina display, and up to 18-hour battery life.",
    price: 399,
    countInStock: 45,
    rating: 4.8,
    numReviews: 205,
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    image: "https://www.ray-ban.com/media/catalog/product/R/B/RB3025__003_32__P21.png",
    brand: "Ray-Ban",
    quantity: 90,
    category: catMap["Accessories"],
    description:
      "Classic gold metal frame with crystal green lenses. 100% UV protection.",
    price: 174,
    countInStock: 90,
    rating: 4.7,
    numReviews: 640,
  },
  {
    name: "Fossil Gen 6 Smartwatch",
    image: "https://fossil.scene7.com/is/image/FossilPartners/FTW4061_main?$sfcc-product-tile$",
    brand: "Fossil",
    quantity: 35,
    category: catMap["Accessories"],
    description:
      "Wear OS smartwatch with Snapdragon 4100+, heart rate tracking, and NFC payments.",
    price: 249,
    countInStock: 35,
    rating: 4.3,
    numReviews: 178,
  },

  // ── Home & Kitchen ────────────────────────────────────────────
  {
    name: "Instant Pot Duo 7-in-1",
    image: "https://m.media-amazon.com/images/I/71V1DqhLRRL._AC_SX679_.jpg",
    brand: "Instant Pot",
    quantity: 55,
    category: catMap["Home & Kitchen"],
    description:
      "7-in-1 electric pressure cooker — pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer.",
    price: 79,
    countInStock: 55,
    rating: 4.8,
    numReviews: 2300,
  },
  {
    name: "Dyson V15 Detect Vacuum",
    image: "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/vacuum-cleaners/stick/dyson-v15-detect/dyson-v15-detect-absolute-yellow-nickel.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=960",
    brand: "Dyson",
    quantity: 25,
    category: catMap["Home & Kitchen"],
    description:
      "Laser reveals hidden dust. Automatically adapts suction to the task. Up to 60 minutes run time.",
    price: 749,
    countInStock: 25,
    rating: 4.7,
    numReviews: 412,
  },
  {
    name: "Nespresso Vertuo Next Coffee Machine",
    image: "https://m.media-amazon.com/images/I/61hZCVqWxBL._AC_SX679_.jpg",
    brand: "Nespresso",
    quantity: 70,
    category: catMap["Home & Kitchen"],
    description:
      "Brews five cup sizes from espresso to alto. Centrifusion™ technology for rich crema every time.",
    price: 179,
    countInStock: 70,
    rating: 4.6,
    numReviews: 890,
  },
];

async function seed() {
  await connectDB();

  console.log("🗑  Clearing existing products and categories...");
  await Product.deleteMany({});
  await Category.deleteMany({});

  console.log("📦  Inserting categories...");
  const insertedCategories = await Category.insertMany(categories);

  // Build a name → _id map
  const catMap = {};
  insertedCategories.forEach((c) => {
    catMap[c.name] = c._id;
  });

  console.log("🛒  Inserting products...");
  await Product.insertMany(getProducts(catMap));

  console.log(`✅  Seeded ${insertedCategories.length} categories and ${getProducts(catMap).length} products successfully!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seeding failed:", err);
  process.exit(1);
});
