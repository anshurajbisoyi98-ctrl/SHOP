const connectDB = require("../backend/config/db.js");
const app = require("../backend/index.js");

// Vercel serverless handler — ensure DB is connected before handling requests
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
