// Backend/Route/ReplyRoute.js
const express = require("express");
const router = express.Router();
const Reply = require("../Model/ReplyModel");
const Ticket = require("../Model/Ticketmodel");

// -------- Helpers --------

// Normalize role (so CustomerCareOfficer → Support_Manager internally)
function normalizeRole(r) {
  if (!r) return "";
  const role = String(r).trim();
  if (role === "CustomerCareOfficer") return "Support_Manager";
  return role;
}

// Support roles (allowed to reply)
function isSupportRole(role) {
  const r = normalizeRole(role).toLowerCase();
  return r === "support_manager";
}

// Admin board roles (can see all replies, but not always reply)
function isAdminBoard(role) {
  const r = normalizeRole(role).toLowerCase();
  return ["support_manager", "manager", "usermanager"].includes(r);
}

// --------- Middlewares ---------
async function assertOwnerOrAdminBoardByTicketId(req, res, next) {
  try {
    const role = normalizeRole(req.query.role);
    const { userId } = req.query;
    const t = await Ticket.findById(req.params.ticketId);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    if (isAdminBoard(role) || String(t.userId) === String(userId)) {
      req.ticket = t;
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    console.error("Auth check error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

async function assertOwnerOrAdminBoardByReplyId(req, res, next) {
  try {
    const role = normalizeRole(req.query.role);
    const { userId } = req.query;
    const r = await Reply.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Reply not found" });

    const t = await Ticket.findById(r.ticketId);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    if (isAdminBoard(role) || String(t.userId) === String(userId)) {
      req.reply = r;
      req.ticket = t;
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    console.error("Auth check error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------- Endpoints ---------

// Add reply
// - Support_Manager (and CustomerCareOfficer normalized → Support_Manager) can reply to any ticket
// - Customer can only reply to their own ticket
router.post("/", async (req, res) => {
  try {
    const { ticketId, message } = req.body;
    const { role, userId } = req.query;

    if (!ticketId || !message) {
      return res.status(400).json({ message: "ticketId and message are required" });
    }
    const t = await Ticket.findById(ticketId);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    const callerRole = normalizeRole(role);

    // Check permissions
    const isSupport = isSupportRole(callerRole);
    const isOwner = String(t.userId) === String(userId);

    if (!(isSupport || isOwner)) {
      return res.status(403).json({ message: "Only Support staff or ticket owner can reply" });
    }

    const senderRole = isSupport ? "Support_Manager" : "customer";
    const reply = await Reply.create({ ticketId, senderRole, message });

    // If support replies, auto-mark ticket answered
    if (isSupport && t.status !== "Answered") {
      t.status = "Answered";
      t.answeredAt = new Date();
      await t.save();
    }

    res.json({ reply });
  } catch (e) {
    console.error("Add reply error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all replies for a ticket
// Visible to Admin board OR ticket owner
router.get("/ticket/:ticketId", assertOwnerOrAdminBoardByTicketId, async (req, res) => {
  try {
    const replies = await Reply.find({ ticketId: req.params.ticketId }).sort({ createdAt: 1 });
    res.json({ replies });
  } catch (e) {
    console.error("Get replies error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark replies as read (only owner or admin board)
router.put("/mark-read/:ticketId", assertOwnerOrAdminBoardByTicketId, async (req, res) => {
  try {
    await Reply.updateMany(
      { ticketId: req.params.ticketId, isReadByCustomer: false },
      { $set: { isReadByCustomer: true } }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("Mark read error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a reply
router.put("/:id", assertOwnerOrAdminBoardByReplyId, async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.message === "string") update.message = req.body.message;
    const updated = await Reply.findByIdAndUpdate(req.reply._id, update, { new: true });
    res.json({ reply: updated });
  } catch (e) {
    console.error("Update reply error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a reply
router.delete("/:id", assertOwnerOrAdminBoardByReplyId, async (req, res) => {
  try {
    await req.reply.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error("Delete reply error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin board overview: list all replies (only board, not customers)
router.get("/", async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    if (!isAdminBoard(callerRole)) return res.status(403).json({ message: "Forbidden" });

    const replies = await Reply.find().sort({ createdAt: -1 });
    res.json({ replies });
  } catch (e) {
    console.error("List all replies error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

