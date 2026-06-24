// Backend/Route/TicketRoute.js
const express = require("express");
const router = express.Router();
const Ticket = require("../Model/Ticketmodel");

// -------- Helpers --------

// Normalize role so both "CustomerCareOfficer" and "Support_Manager" are treated the same
function normalizeRole(r) {
  if (!r) return "";
  const role = String(r).trim();
  if (role === "CustomerCareOfficer") return "Support_Manager";
  return role;
}

// Roles that can see ALL tickets (admin board)
function isAdminBoard(role) {
  const r = normalizeRole(role).toLowerCase();
  return ["support_manager", "customercareofficer", "manager", "usermanager","EmployeeManager", "PaymentManager","VehicleMechanic","VehiclePartsManager"].includes(r);
}

// Support roles (reply/update etc.)
function isSupportRole(role) {
  const r = normalizeRole(role).toLowerCase();
  return r === "support_manager" || r === "customercareofficer";
}

// Middleware to check if caller is owner or support/admin
async function assertOwnerOrManager(req, res, next) {
  try {
    const callerRole = normalizeRole(req.query.role);
    const { userId } = req.query;
    const t = await Ticket.findById(req.params.id || req.params.ticketId);
    if (!t) return res.status(404).json({ message: "Ticket not found" });

    if (isAdminBoard(callerRole) || String(t.userId) === String(userId)) {
      req.ticket = t;
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    console.error("Auth check error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// -------- CRUD --------

// Create ticket (customer only)
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, subject, description, priority } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const ticket = await Ticket.create({
      userId,
      name,
      email: String(email).toLowerCase(),
      subject,
      description,
      priority,
      status: "Open",
    });
    res.json({ ticket });
  } catch (e) {
    console.error("Create ticket error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// List tickets (admin board = all, customer = only own)
router.get("/", async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    const { userId, status } = req.query;

    let q = {};
    if (!isAdminBoard(callerRole)) {
      if (!userId) {
        return res.status(400).json({ message: "userId is required for customers" });
      }
      q.userId = userId;
    }

    if (status) q.status = status;

    const tickets = await Ticket.find(q).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (e) {
    console.error("List tickets error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single ticket (owner or admin/support)
router.get("/:id", assertOwnerOrManager, async (req, res) => {
  res.json({ ticket: req.ticket });
});

// Update ticket (owner or support/admin board)
router.put("/:id", assertOwnerOrManager, async (req, res) => {
  try {
    const update = { ...req.body };
    // never allow changing owner
    delete update.userId;

    const updated = await Ticket.findByIdAndUpdate(
      req.ticket._id,
      update,
      { new: true, runValidators: true }
    );
    res.json({ ticket: updated });
  } catch (e) {
    console.error("Update ticket error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete ticket (owner or support/admin board)
router.delete("/:id", assertOwnerOrManager, async (req, res) => {
  try {
    await req.ticket.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error("Delete ticket error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// (Optional) mark ticket read
router.put("/:id/mark-read", assertOwnerOrManager, async (req, res) => {
  try {
    res.json({ ok: true }); // replies are marked in ReplyRoute
  } catch (e) {
    console.error("Mark ticket read error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
