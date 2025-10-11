// routes/vehicle.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../model/vehicle");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


router.get("/test", (req, res) => res.send("✅ Vehicle route working"));


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      vehicleID,
      name,
      type,
      brand,
      model,
      year,
      price,
      status,
      user,
      userID,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const newVehicle = new Vehicle({
      vehicleID,
      name,
      type,
      brand,
      model,
      year,
      price,
      status,
      image,
      user,    // for user filtering
      userID,  // for user filtering
    });

    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    const filter = userID ? { userID } : {};
    const vehicles = await Vehicle.find(filter);
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedVehicle)
      return res.status(404).json({ message: "Vehicle not found" });

    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle)
      return res.status(404).json({ message: "Vehicle not found" });

   
    if (deletedVehicle.image) {
      const imgPath = path.join(uploadDir, deletedVehicle.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
