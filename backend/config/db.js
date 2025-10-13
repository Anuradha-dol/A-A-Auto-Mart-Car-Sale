const mongoose = require("mongoose");

const dburl = "mongodb+srv://anuradhawork123:20021214@cluster0.9umgipm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Strict query mode
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(dburl); // No deprecated options needed
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
