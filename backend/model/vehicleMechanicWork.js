const mongoose = require("mongoose");

const VehicleMechanicWorkSchema = new mongoose.Schema(
  {
    workID: { type: String, unique: true, required: true }, // unique ID for each work
    vehicleDetails: { type: String, required: true },
    workDescription: { type: String, required: true },
    partsUsed: [
      {
        partName: String,
        partNumber: String,
        quantity: Number,
      },
    ],
    expectedCompletionDate: Date,
    cost: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userID: { type: String, required: true },
    status: { type: String, default: "Pending" },
    reportedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleMechanicWork", VehicleMechanicWorkSchema);
