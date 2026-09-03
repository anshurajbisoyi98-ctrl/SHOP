const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`Successfully connected to mongoDB: ${conn.connection.host} 👍`);
  } catch (error) {
    console.error(`MongoDB connection ERROR: ${error.message}`);
    // Don't call process.exit() on Vercel — it kills the serverless function
    throw error;
  }
};

module.exports = connectDB;
