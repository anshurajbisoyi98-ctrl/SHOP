# 🛍️ ShopVerse — Full-Stack MERN E-Commerce Platform

A modern, full-featured **MERN (MongoDB, Express.js, React, Node.js)** e-commerce application equipped with JWT authentication, product catalog filtering, cart & favorites state management with Redux Toolkit (RTK Query), PayPal sandbox integration, and an administrative control panel.

---

## 📑 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Folder & Directory Structure](#-folder--directory-structure)
3. [Feature-to-File Navigation Matrix (Mentor Guide)](#-feature-to-file-navigation-matrix)
4. [Architecture & Data Flow](#-architecture--data-flow)
5. [Backend API Endpoints](#-backend-api-endpoints)
6. [Environment Variables](#-environment-variables)
7. [Local Setup & Installation](#-local-setup--installation)
8. [Database Seeding](#-database-seeding)
9. [Deployment Guide (Vercel & Render)](#-deployment-guide)
10. [How to Add or Modify Features](#-how-to-add-or-modify-features)

---

## 🚀 Tech Stack

- **Frontend:** React 18 (Vite), Redux Toolkit & RTK Query, Tailwind CSS, Flowbite, React Icons, React Slick Carousel, ApexCharts, React Toastify
- **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM), JSON Web Tokens (JWT), Cookie Parser, Multer & Formidable (File Uploads), CORS
- **Database:** MongoDB Atlas (Cloud) / Local MongoDB
- **Payment Gateway:** PayPal JavaScript SDK Integration
- **Hosting / Deployments:** Vercel (Serverless Function Architecture) & Render

---

## 📂 Folder & Directory Structure

```
shopcopy-main/
│
├── api/                         # Vercel Serverless Function Entrypoint
│   └── index.js                 # Wraps Express app and ensures DB connection for Vercel
│
├── backend/                     # Express.js REST API & Business Logic
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose connection with caching & error handling
│   │
│   ├── controllers/             # Request handling and business logic
│   │   ├── userController.js    # Register, login, logout, profile update, admin user CRUD
│   │   ├── productController.js # Product CRUD, top/new products, reviews, filtering
│   │   ├── categoryController.js# Category CRUD operations
│   │   └── orderController.js   # Create order, payment status, deliver status, analytics
│   │
│   ├── middlewares/             # Custom Express middlewares
│   │   ├── authMiddleware.js    # authenticate (JWT verification) & authorizeAdmin
│   │   ├── checkId.js           # Validates MongoDB ObjectId format
│   │   ├── asyncHandler.js      # Wraps async routes to eliminate try-catch boilerplate
│   │   └── errorMiddleware.js   # Centralized 404 (notFound) and 500 (errorHandler)
│   │
│   ├── models/                  # Mongoose schemas & data models
│   │   ├── userModel.js         # User schema (name, email, password hashing, isAdmin)
│   │   ├── productModel.js      # Product schema (reviews sub-schema, category ref, stock)
│   │   ├── categoryModel.js     # Category schema (unique name)
│   │   └── orderModel.js        # Order schema (orderItems, shippingAddress, paymentResult)
│   │
│   ├── routes/                  # Express route definitions mapped to controllers
│   │   ├── userRoutes.js        # /api/users
│   │   ├── productRoutes.js     # /api/products
│   │   ├── categoryRoutes.js    # /api/category
│   │   ├── orderRoutes.js       # /api/orders
│   │   └── uploadRoutes.js      # /api/upload (Multer image upload route)
│   │
│   ├── utils/
│   │   └── createToken.js       # Generates JWT and sets HTTP-only secure cookie
│   ├── index.js                 # Main Express server entrypoint (local & traditional server)
│   └── seeder.js                # Database seeder (inserts categories & 17 sample products)
│
├── frontend/                    # Vite React Single Page Application (SPA)
│   ├── public/                  # Public static assets
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Header.jsx       # Home banner + Product carousel combo
│   │   │   ├── Loader.jsx       # Animated loading spinner
│   │   │   ├── Message.jsx      # Alert notification box (error / info / success)
│   │   │   ├── Modal.jsx        # Pop-up modal window (used in admin category manager)
│   │   │   ├── CategoryForm.jsx # Input form for category creation / update
│   │   │   ├── PrivateRoute.jsx # Route guard: Redirects unauthenticated users to /login
│   │   │   └── ProgressSteps.jsx# Step indicator (Login -> Shipping -> Place Order)
│   │   │
│   │   ├── pages/               # Page Views / Routes
│   │   │   ├── Home.jsx         # Landing page with banner carousel and special products
│   │   │   ├── Shop.jsx         # Product catalog with category filter, price filter, reset
│   │   │   ├── Cart.jsx         # Shopping cart page with quantity adjustments & checkout
│   │   │   │
│   │   │   ├── Auth/            # Authentication Pages
│   │   │   │   ├── Login.jsx    # User login page
│   │   │   │   ├── Register.jsx # User registration page
│   │   │   │   ├── Navigation.jsx # Sidebar navigation menu with user/admin dropdown
│   │   │   │   └── Navigation.css # Sidebar styling & drawer transitions
│   │   │   │
│   │   │   ├── Products/        # Product Detail & Sub-components
│   │   │   │   ├── Product.jsx         # Single product card component
│   │   │   │   ├── ProductCard.jsx     # Detailed product card with buy/view actions
│   │   │   │   ├── ProductCarousel.jsx # Top-rated products slider
│   │   │   │   ├── ProductDetails.jsx  # Individual product page with reviews & rating form
│   │   │   │   ├── ProductTabs.jsx     # Tab switcher (Reviews / Add Review / Related)
│   │   │   │   ├── Ratings.jsx         # Reusable star rating indicator
│   │   │   │   ├── SmallProduct.jsx    # Compact product item for carousels
│   │   │   │   ├── Favorites.jsx       # Saved wishlist products page
│   │   │   │   ├── FavoritesCount.jsx  # Badge indicator for total saved favorites
│   │   │   │   └── HeartIcon.jsx       # Interactive toggle button for wishlist
│   │   │   │
│   │   │   ├── Orders/          # Checkout & Order Management Pages
│   │   │   │   ├── Shipping.jsx   # Step 2: Shipping address entry form
│   │   │   │   ├── PlaceOrder.jsx # Step 3: Order summary review & order creation
│   │   │   │   └── Order.jsx      # Step 4: Order details, PayPal payment, Delivery status
│   │   │   │
│   │   │   ├── User/            # Customer User Pages
│   │   │   │   ├── Profile.jsx   # User profile management (update name, email, password)
│   │   │   │   └── UserOrder.jsx # List of orders placed by the current user
│   │   │   │
│   │   │   └── Admin/           # Admin Dashboard & Management Pages
│   │   │       ├── AdminRoute.jsx     # Route guard: Restricts pages to `user.isAdmin === true`
│   │   │       ├── AdminMenu.jsx      # Admin quick-navigation pill bar
│   │   │       ├── AdminDashboard.jsx # Sales charts, total revenue, orders analytics
│   │   │       ├── CategoryList.jsx   # Manage product categories (Create, Update, Delete)
│   │   │       ├── ProductList.jsx    # Create new product with image upload
│   │   │       ├── AllProducts.jsx    # Manage all existing products
│   │   │       ├── ProductUpdate.jsx  # Edit existing product details & delete product
│   │   │       ├── UserList.jsx       # View and manage users, toggle admin role, delete
│   │   │       └── OrderList.jsx      # View all customer orders & mark delivered
│   │   │
│   │   ├── redux/               # Global State Management (Redux Toolkit)
│   │   │   ├── store.js         # Redux Store configuration with middleware
│   │   │   ├── constants.js     # API base URL path constants
│   │   │   ├── api/             # RTK Query API Slices (Data Fetching & Caching)
│   │   │   │   ├── apiSlice.js         # Root base RTK query slice
│   │   │   │   ├── usersApiSlice.js    # Auth & user API endpoints
│   │   │   │   ├── productApiSlice.js  # Product fetch/filter/CRUD/review endpoints
│   │   │   │   ├── categoryApiSlice.js # Category fetch/CRUD endpoints
│   │   │   │   └── orderApiSlice.js    # Order create/pay/deliver/stats endpoints
│   │   │   └── features/        # Client-side State Slices
│   │   │       ├── auth/authSlice.js           # User login credentials & localStorage sync
│   │   │       ├── cart/cartSlice.js           # Cart items, shipping address, price calculations
│   │   │       ├── favorites/favoriteSlice.js  # Saved wishlist items & localStorage sync
│   │   │       └── shop/shopSlice.js           # Category/price search filter states
│   │   │
│   │   ├── Utils/
│   │   │   ├── cartUtils.js     # Calculates itemsPrice, shippingPrice, taxPrice, totalPrice
│   │   │   └── localStorage.js  # LocalStorage helper functions for favorites
│   │   │
│   │   ├── App.jsx              # App layout with Sidebar Navigation, Toast container, Outlet
│   │   ├── main.jsx             # React DOM root render with Router and Redux Provider
│   │   └── index.css            # Tailwind & global stylesheet
│   │
│   ├── package.json             # Frontend dependencies and Vite scripts
│   ├── tailwind.config.js       # Tailwind CSS design system configuration
│   └── vite.config.js           # Vite build and development proxy configuration
│
├── categories_import.json       # JSON file for manual MongoDB Compass Category import
├── products_import.json         # JSON file for manual MongoDB Compass Product import
├── package.json                 # Root project package file with orchestration scripts
├── vercel.json                  # Vercel deployment configuration
└── render.yaml                  # Render Infrastructure-as-Code blueprint configuration
```

---

## 🔍 Feature-to-File Navigation Matrix

Use this quick-lookup table to find the exact files responsible for any feature:

| Feature / Requirement | Frontend UI Component | Redux RTK Query / Slice | Backend Route & Controller | Database Model |
|---|---|---|---|---|
| **User Login & JWT** | `frontend/src/pages/Auth/Login.jsx` | `usersApiSlice.js`, `authSlice.js` | `routes/userRoutes.js`, `userController.js:loginUser` | `models/userModel.js` |
| **User Registration** | `frontend/src/pages/Auth/Register.jsx` | `usersApiSlice.js` | `routes/userRoutes.js`, `userController.js:createUser` | `models/userModel.js` |
| **User Profile Edit** | `frontend/src/pages/User/Profile.jsx` | `usersApiSlice.js` | `routes/userRoutes.js`, `userController.js:updateCurrentUserProfile` | `models/userModel.js` |
| **Product Catalog & Filters** | `frontend/src/pages/Shop.jsx` | `productApiSlice.js`, `shopSlice.js` | `routes/productRoutes.js`, `productController.js:filterProducts` | `models/productModel.js` |
| **Product Details & Reviews** | `frontend/src/pages/Products/ProductDetails.jsx` | `productApiSlice.js` | `routes/productRoutes.js`, `productController.js:addProductReview` | `models/productModel.js` |
| **Cart & Pricing Math** | `frontend/src/pages/Cart.jsx` | `cartSlice.js`, `cartUtils.js` | Local client state (persisted to DB at checkout) | — |
| **Wishlist / Favorites** | `frontend/src/pages/Products/Favorites.jsx` | `favoriteSlice.js` | Local client state / LocalStorage | — |
| **Checkout Flow (Shipping)** | `frontend/src/pages/Orders/Shipping.jsx` | `cartSlice.js:saveShippingAddress` | Local client state | `models/orderModel.js` |
| **Place Order** | `frontend/src/pages/Orders/PlaceOrder.jsx` | `orderApiSlice.js:createOrder` | `routes/orderRoutes.js`, `orderController.js:createOrder` | `models/orderModel.js` |
| **PayPal Payment** | `frontend/src/pages/Orders/Order.jsx` | `orderApiSlice.js:payOrder` | `routes/orderRoutes.js`, `orderController.js:markOrderAsPaid` | `models/orderModel.js` |
| **Admin Dashboard Analytics** | `frontend/src/pages/Admin/AdminDashboard.jsx` | `orderApiSlice.js:calculateTotalSalesByDate` | `routes/orderRoutes.js`, `orderController.js:calculateTotalSalesByDate` | `models/orderModel.js` |
| **Admin Product CRUD** | `frontend/src/pages/Admin/ProductList.jsx` | `productApiSlice.js` | `routes/productRoutes.js`, `productController.js:addProduct` | `models/productModel.js` |
| **Admin Category CRUD** | `frontend/src/pages/Admin/CategoryList.jsx` | `categoryApiSlice.js` | `routes/categoryRoutes.js`, `categoryController.js` | `models/categoryModel.js` |
| **Admin User Management** | `frontend/src/pages/Admin/UserList.jsx` | `usersApiSlice.js` | `routes/userRoutes.js`, `userController.js:getAllUsers` | `models/userModel.js` |
| **Admin Order Management** | `frontend/src/pages/Admin/OrderList.jsx` | `orderApiSlice.js` | `routes/orderRoutes.js`, `orderController.js:markOrderAsDelivered` | `models/orderModel.js` |
| **Image Uploads** | `frontend/src/pages/Admin/ProductList.jsx` | `productApiSlice.js:uploadProductImage` | `routes/uploadRoutes.js` (Multer disk storage) | — |

---

## 🏗️ Architecture & Data Flow

```
[User Browser]
      │
      ▼
[React UI (Vite SPA)] ──(Dispatches action / calls hook)──► [Redux RTK Query Slices]
                                                                     │
                                                      (HTTP Request with JWT Cookie)
                                                                     │
                                                                     ▼
                                                          [Express Router (/api/*)]
                                                                     │
                                                     (Auth / Validation Middlewares)
                                                                     │
                                                                     ▼
                                                           [Controller Layer]
                                                                     │
                                                         (Mongoose ODM Queries)
                                                                     │
                                                                     ▼
                                                          [MongoDB Atlas Database]
```

---

## 📡 Backend API Endpoints

### 👤 Authentication & Users (`/api/users`)
- `POST /api/users` — Register a new user
- `POST /api/users/auth` — Login user & obtain JWT cookie
- `POST /api/users/logout` — Clear JWT cookie
- `GET /api/users/profile` — Get current user profile *(Protected)*
- `PUT /api/users/profile` — Update current user profile *(Protected)*
- `GET /api/users` — List all users *(Admin only)*
- `DELETE /api/users/:id` — Delete user by ID *(Admin only)*
- `GET /api/users/:id` — Get user details *(Admin only)*
- `PUT /api/users/:id` — Update user role/info *(Admin only)*

### 📦 Products (`/api/products`)
- `GET /api/products` — Fetch paginated products / keyword search
- `GET /api/products/:id` — Fetch single product details
- `GET /api/products/allproducts` — Fetch all products without pagination *(Admin)*
- `GET /api/products/top` — Fetch top-rated products
- `GET /api/products/new` — Fetch newly added products
- `POST /api/products` — Create new product with formidable *(Admin)*
- `PUT /api/products/:id` — Update product details *(Admin)*
- `DELETE /api/products/:id` — Delete product *(Admin)*
- `POST /api/products/filtered-products` — Query products by category & price range
- `POST /api/products/:id/reviews` — Add a product review *(Protected)*

### 🏷️ Categories (`/api/category`)
- `GET /api/category/categories` — List all categories
- `GET /api/category/:id` — Read single category
- `POST /api/category` — Create category *(Admin)*
- `PUT /api/category/:categoryId` — Update category *(Admin)*
- `DELETE /api/category/:categoryId` — Delete category *(Admin)*

### 💳 Orders (`/api/orders`)
- `POST /api/orders` — Create new customer order *(Protected)*
- `GET /api/orders/mine` — Get orders of logged-in user *(Protected)*
- `GET /api/orders/:id` — Get order by ID *(Protected)*
- `PUT /api/orders/:id/pay` — Update order to paid *(Protected)*
- `GET /api/orders` — List all customer orders *(Admin)*
- `GET /api/orders/total-orders` — Get total count of orders *(Admin)*
- `GET /api/orders/total-sales` — Get sum of all sales revenue *(Admin)*
- `GET /api/orders/total-sales-by-date` — Sales analytics for dashboard charts *(Admin)*
- `PUT /api/orders/:id/deliver` — Mark order as delivered *(Admin)*

### 🖼️ Uploads & Config
- `POST /api/upload` — Upload single image file using Multer
- `GET /api/config/paypal` — Returns PayPal Client ID from environment

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Port
PORT=3000

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopping?retryWrites=true&w=majority

# App Environment (development | production)
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# PayPal Sandbox Client ID (from developer.paypal.com)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/anshurajbisoyi98-ctrl/SHOP.git
cd SHOP
```

### 2. Install all dependencies (Backend & Frontend)
```bash
npm install
npm install --prefix frontend
```

### 3. Configure Environment Variables
Copy the `.env.example` to `.env` and fill in your MongoDB Atlas URI:
```bash
cp .env.example .env
```

### 4. Seed the Database
Populate your database with the initial 5 categories and 17 products:
```bash
npm run seed
# or: node backend/seeder.js
```

### 5. Run the Application in Development Mode
Starts both Backend (`http://localhost:3000`) and Frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

---

## 🗄️ Database Seeding

You can seed the database via script or MongoDB Compass:

### Option A: Automatic Script (Recommended)
```bash
node backend/seeder.js
```

### Option B: Manual MongoDB Compass Import
1. Connect MongoDB Compass to your MongoDB Atlas cluster.
2. Select database `shopping`.
3. Import `categories_import.json` into collection **`categories`**.
4. Import `products_import.json` into collection **`products`**.

---

## 🌐 Deployment Guide

### Deploying to Vercel (Serverless Architecture)
1. Import repository into **Vercel**.
2. **Build Settings**:
   - Framework Preset: `Other`
   - Root Directory: *(Leave blank)*
   - Build Command: *(Leave blank — managed by vercel.json)*
   - Output Directory: *(Leave blank — managed by vercel.json)*
3. **Environment Variables**: Add `MONGO_URI`, `NODE_ENV=production`, `JWT_SECRET`, `PAYPAL_CLIENT_ID`.
4. Click **Deploy**.

### Deploying to Render (Full-Stack Node.js Service)
1. Create a **Web Service** linked to the repo on Render.
2. **Build Command**: `npm install` (triggers automatic `postinstall` to build frontend).
3. **Start Command**: `npm start`.
4. **Environment Variables**: Add `MONGO_URI`, `NODE_ENV=production`, `JWT_SECRET`, `PAYPAL_CLIENT_ID`.
5. Click **Create Web Service**.

---

## 🛠️ How to Add or Modify Features

Follow this 5-step checklist whenever you or your mentor want to add a new feature:

```
Step 1: Database Model  ──► Create/update schema in `backend/models/<ModelName>.js`
Step 2: Controller      ──► Implement business logic in `backend/controllers/<controller>.js`
Step 3: API Route       ──► Mount Express endpoint in `backend/routes/<route>.js` & `backend/index.js`
Step 4: RTK Query Slice ──► Add query/mutation in `frontend/src/redux/api/<apiSlice>.js`
Step 5: Frontend UI     ──► Build or update React component in `frontend/src/pages/`
```

---

## 👥 Contributors & Acknowledgements
- **Author:** HuXn WebDev / Anshu Raj Bisoyi
- **License:** ISC
