// model/payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Linked to the Order
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Linked to User
    },
    userID: {
      type: String,
      required: true, // Custom business userID (like USR123)
    },
    amount: {
      type: Number,
      required: true, // Paid amount
    },
    slipImage: {
      type: String,
      required: true, // File path or URL of the uploaded slip image
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // default until admin approves
    },
    notes: {
      type: String, // optional notes about payment
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
