const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "customer",
      "manager",
      "EmployeeManager",
      "PaymentManager",
      "UserManager",
      "VehicleMechanic",
      "VehiclePartsManager",
      "CustomerCareOfficer",
      "Support_Manager"
    ],
    required: true,
  },
  }, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);