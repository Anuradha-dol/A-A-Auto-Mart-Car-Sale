const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,   // owner of the ticket (customer)
    ref: "User",                            // optional if you don't have users collection
    required: true
  },
  name: String,
  email: String,
  subject: String,
  description: String,
  priority: { type: String, default: "Low" },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Answered", "Closed"],
    default: "Open",
  },
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date } // <-- add this
},{ timestamps: true });

module.exports = mongoose.model(
    "Ticketmodel",//file name
     ticketSchema//function name
)