const express = require("express");
const router = express.Router();
const VehiclePart = require("../model/vehiclePart");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads 
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ TEST route
router.get("/test", (req, res) => res.send("✅ Vehicle Parts route working"));


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      partID,
      name,
      type,
      brand,
      model,
      quantity,
      price,
      status,
      user,
      userID,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const newPart = new VehiclePart({
      partID,
      name,
      type,
      brand,
      model,
      quantity,
      price,
      status,
      image,
      user,   
      userID,  
    });

    await newPart.save();
    res.status(201).json(newPart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    const filter = userID ? { userID } : {};
    const parts = await VehiclePart.find(filter);
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const part = await VehiclePart.findById(req.params.id);
    if (!part) return res.status(404).json({ message: "Part not found" });
    res.json(part);
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

    const updatedPart = await VehiclePart.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPart)
      return res.status(404).json({ message: "Part not found" });

    res.json(updatedPart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedPart = await VehiclePart.findByIdAndDelete(req.params.id);
    if (!deletedPart)
      return res.status(404).json({ message: "Part not found" });

    res.json({ message: "Part deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
