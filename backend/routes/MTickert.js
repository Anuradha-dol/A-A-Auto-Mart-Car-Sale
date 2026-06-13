const express = require("express");
const router = express.Router();
const VehiclePartRequest = require("../model/MTickert");


router.get("/test", (req, res) => res.send("✅ Vehicle Part Requests route working"));


router.post("/", async (req, res) => {
  try {
    const { partName, partNumber, quantity, neededByDate, user, userID } = req.body;

    const newRequest = new VehiclePartRequest({
      partName,
      partNumber,
      quantity,
      requestDate: new Date(),
      neededByDate,
      user,
      userID,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    const filter = userID ? { userID } : {};
    const requests = await VehiclePartRequest.find(filter);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const request = await VehiclePartRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const updatedRequest = await VehiclePartRequest.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedRequest = await VehiclePartRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest)
      return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
