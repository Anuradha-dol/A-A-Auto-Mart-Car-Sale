const mongoose = require("mongoose");

// Strict query mode
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const dburl = process.env.MONGO_URI;

    if (!dburl) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(dburl);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
