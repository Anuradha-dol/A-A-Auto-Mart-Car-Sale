const express = require("express");
const router = express.Router();
const VehicleMechanicWork = require("../model/vehicleMechanicWork");


router.post("/", async (req, res) => {
  try {
    const newWork = new VehicleMechanicWork(req.body);
    await newWork.save();
    res.status(201).json(newWork);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const works = await VehicleMechanicWork.find();
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const work = await VehicleMechanicWork.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedWork = await VehicleMechanicWork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedWork) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.json(updatedWork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await VehicleMechanicWork.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
