// routes/payment.js
const express = require("express");
const router = express.Router();
const Payment = require("../model/payment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadDir = path.join(__dirname, "../uploads/payments");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Test route
router.get("/test", (req, res) => res.send("✅ Payment route working"));


router.post("/", upload.single("slipImage"), async (req, res) => {
  try {
    const { order, user, userID, amount, notes } = req.body;
    if (!req.file) return res.status(400).json({ message: "Slip image is required" });

    const slipImage = req.file.filename;

    const newPayment = new Payment({
      order,
      user,
      userID,
      amount,
      slipImage,
      notes,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    const filter = userID ? { userID } : {};
    const payments = await Payment.find(filter).populate("order").populate("user");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("order").populate("user");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
    res.json(updatedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
