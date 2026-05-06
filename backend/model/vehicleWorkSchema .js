const mongoose = require("mongoose");

const vehicleWorkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB _id of the customer
      ref: "User",
      required: true,
    },
    userID: {
      type: String, // your custom userID from User model
      required: true,
    },
    vehicleDetails: {
      type: String, // e.g., vehicle model, plate number
      required: true,
    },
    workDescription: {
      type: String, // Description of work done or to be done
      required: true,
    },
    partsUsed: [
      {
        partName: { type: String, required: true },
        partNumber: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    reportedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedCompletionDate: {
      type: Date, // when mechanic expects the work to be done
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Work Done"],
      default: "Pending",
    },
    cost: {
      type: Number, // Optional total cost of work
      required: false,
    },
  },
  { timestamps: true }
);

const VehicleWork =
  mongoose.models.VehicleWork || mongoose.model("VehicleWork", vehicleWorkSchema);

module.exports = VehicleWork;
