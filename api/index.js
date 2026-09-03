const connectDB = require("../backend/config/db.js");
const app = require("../backend/index.js");

// Vercel serverless handler — ensure DB is connected before handling requests
module.exports = async (req, res) => {
  try {
    // Debug: log env var presence (not the value for security)
    if (!process.env.MONGO_URI) {
      return res.status(500).json({
        error: "MONGO_URI environment variable is NOT set on Vercel",
        fix: "Go to Vercel → Settings → Environment Variables → add MONGO_URI"
      });
    }
    await connectDB();
    return app(req, res);
  } catch (err) {
    return res.status(500).json({
      error: "DB connection failed",
      message: err.message
    });
  }
};
