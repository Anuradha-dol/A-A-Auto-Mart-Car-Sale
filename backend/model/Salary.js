const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Should match your user model name
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true, // e.g., "2025-09"
  },
  totalSalary: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Salary", SalarySchema);
