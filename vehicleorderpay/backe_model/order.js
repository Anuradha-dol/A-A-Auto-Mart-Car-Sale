const mongoose = require("mongoose");

const PartSchema = new mongoose.Schema({
  partID: { type: String, required: true },
  name: { type: String, required: true },
  type: String,
  brand: String,
  model: String,
  price: Number,
  quantity: Number,
  image: String,
  userID: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const VehicleSchema = new mongoose.Schema({
 vehicleID: { type: String, required: true, unique: true },  // changed to vehicleID
    name: { type: String, required: true },
  type: String,
  brand: String,
  model: String,
  year: Number,
  price: Number,
  image: String,
  userID: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const OrderSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "Cart" },
    notes: { type: String },
    parts: { type: [PartSchema], default: [] },       // Array of Part objects
    vehicles: { type: [VehicleSchema], default: [] }, // Array of Vehicle objects
    total: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
