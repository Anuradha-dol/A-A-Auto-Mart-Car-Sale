const express = require("express");
const router = express.Router();
const VehicleWork = require("../model/VehicleWork"); 


router.get("/test", (req, res) => res.send("✅ Vehicle Work route working"));


router.post("/", async (req, res) => {
  try {
    const {
      vehicleDetails,
      workDescription,
      partsUsed,
      expectedCompletionDate,
      cost,
      user,
      userID,
    } = req.body;

    const newWork = new VehicleWork({
      vehicleDetails,
      workDescription,
      partsUsed,
      reportedDate: new Date(),
      expectedCompletionDate,
      cost,
      user,
      userID,
    });

    await newWork.save();
    res.status(201).json(newWork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    const filter = userID ? { userID } : {};
    const works = await VehicleWork.find(filter);
    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const work = await VehicleWork.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const updatedWork = await VehicleWork.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedWork)
      return res.status(404).json({ message: "Work not found" });

    res.json(updatedWork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedWork = await VehicleWork.findByIdAndDelete(req.params.id);
    if (!deletedWork)
      return res.status(404).json({ message: "Work not found" });

    res.json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
