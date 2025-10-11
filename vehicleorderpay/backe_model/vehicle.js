// model/vehicle.js
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    vehicleID: { type: String, required: true, unique: true },  // changed to vehicleID
    name: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },          // year instead of quantity
    price: { type: Number, required: true },
    status: { type: String, default: "Available" },
    image: { type: String },

    // Fields for filtering by user
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

module.exports = mongoose.model("Vehicle", VehicleSchema);
