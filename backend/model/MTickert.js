const mongoose = require("mongoose");

const vehiclePartRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB _id
      ref: "User",
      required: true,
    },
    userID: {
      type: String, // your custom userID field from User model
      required: true,
    },
    partName: {
      type: String,
      required: true,
    },
    partNumber: {
      type: String,
      required: false, // optional if not all parts have numbers
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    requestDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    neededByDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Ordered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const VehiclePartRequest =
  mongoose.models.VehiclePartRequest ||
  mongoose.model("VehiclePartRequest", vehiclePartRequestSchema);

module.exports = VehiclePartRequest;
