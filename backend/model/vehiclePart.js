// model/vehiclePart.js
const mongoose = require("mongoose");

const VehiclePartSchema = new mongoose.Schema(
  {
    partID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "Available" },
    image: { type: String },

    // ✅ Added fields for filtering by user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehiclePart", VehiclePartSchema);
