const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Ticketmodel",      // ✅ reference your Ticket model name
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["customer", "Support_Manager"], // changed
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // unread flags:
    isReadByCustomer: { 
     type: Boolean, 
     default: function() {

    // if admin sends reply -> customer hasn't read it
     return this.senderRole === "customer" ;
  }},
  isReadBySupport: {
      type: Boolean,
      default: function () {
        // if customer sends a reply → support hasn't read it
        return this.senderRole === "Support_Manager";
      },},},
  { timestamps: true }
);
module.exports = mongoose.model("Reply", ReplySchema);

