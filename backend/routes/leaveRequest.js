const express = require("express");
const router = express.Router();
const LeaveRequest = require("../model/LeaveRequest");//leaveRequestmodelimport

// Create a leave request
router.post("/", async (req, res) => {
  try {
    const leave = new LeaveRequest({
      ...req.body,
      user: req.body.user, 
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate("user", "name email");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate("user", "name email");
    if (!leave) return res.status(404).json({ message: "Leave request not found" });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updatedLeave = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLeave) return res.status(404).json({ message: "Leave request not found" });
    res.json(updatedLeave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deletedLeave = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!deletedLeave) return res.status(404).json({ message: "Leave request not found" });
    res.json({ message: "Leave request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
