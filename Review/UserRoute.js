// Backend/Route/UserRoute.js
const express = require("express");
const router = express.Router();
const User = require("../Model/User");

// ---------------- helpers ----------------

// Roles that are considered "admin" for user CRUD permissions
const ADMIN_ROLES = new Set(["manager", "UserManager"]);

// Some projects still send "CustomerCareOfficer". We will normalize it so DB stores "Support_Manager".
function normalizeRole(r) {
  if (!r) return "";
  const role = String(r).trim();
  if (role === "CustomerCareOfficer") return "Support_Manager";
  return role;
}

function isAdmin(role) {
  return role && ADMIN_ROLES.has(normalizeRole(role));
}

function isOwner(paramId, queryUserId) {
  return String(paramId) === String(queryUserId);
}

async function assertOwnerOrAdminByParamId(req, res, next) {
  try {
    const callerRole = normalizeRole(req.query.role);
    const { userId } = req.query;
    if (isAdmin(callerRole) || isOwner(req.params.id, userId)) return next();
    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    console.error("auth error:", e);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------- CREATE (sign up / admin create) ---------------
router.post("/", async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    const {
      userID, name, email, password, address, phone, role
    } = req.body || {};

    if (!userID || !name || !email || !password || !address || !phone || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize incoming role (maps CustomerCareOfficer -> Support_Manager)
    const roleToSave = normalizeRole(role);

    // Only admins may create non-customer users
    if (roleToSave !== "customer" && !isAdmin(callerRole)) {
      return res.status(403).json({ message: "Only admin can create non-customer users" });
    }

    // NOTE: password is stored as-is per your requirements (no hashing here)
    const user = await User.create({
      userID,
      name,
      email: String(email).toLowerCase(),
      password,
      address,
      phone,
      role: roleToSave,
    });

    res.json({ user });
  } catch (e) {
    console.error("create user error:", e);
    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${key}` });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- LIST ----------------
router.get("/", async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    const { userId, q } = req.query;

    if (isAdmin(callerRole)) {
      const query = {};
      if (q) {
        const rx = new RegExp(String(q).trim(), "i");
        query.$or = [{ name: rx }, { email: rx }, { phone: rx }, { userID: rx }];
      }
      const users = await User.find(query).sort({ createdAt: -1 });
      return res.json({ users });
    }

    // Not admin: must return only myself
    if (!userId) {
      return res.status(400).json({ message: "userId query is required for customers" });
    }
    const me = await User.findById(userId);
    if (!me) return res.json({ users: [] });
    return res.json({ users: [me] });
  } catch (e) {
    console.error("list users error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- READ ONE ----------------
router.get("/:id", assertOwnerOrAdminByParamId, async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({ user: u });
  } catch (e) {
    console.error("get user error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE ----------------
router.put("/:id", assertOwnerOrAdminByParamId, async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    const update = { ...req.body };

    // Never allow changing the unique external id
    delete update.userID;

    // Only admin can change role; normalize if provided
    if (!isAdmin(callerRole)) {
      delete update.role;
    } else if (update.role) {
      update.role = normalizeRole(update.role);
    }

    // Keep email lowercase to respect unique index
    if (update.email) update.email = String(update.email).toLowerCase();

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ user: updated });
  } catch (e) {
    console.error("update user error:", e);
    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${key}` });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE ----------------
router.delete("/:id", assertOwnerOrAdminByParamId, async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "User not found" });
    await u.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error("delete user error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// -------- Optional: lookup by external userID --------
router.get("/by-userID/:userID", async (req, res) => {
  try {
    const callerRole = normalizeRole(req.query.role);
    const { userId } = req.query;

    const u = await User.findOne({ userID: req.params.userID });
    if (!u) return res.status(404).json({ message: "User not found" });

    if (!(isAdmin(callerRole) || String(u._id) === String(userId))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json({ user: u });
  } catch (e) {
    console.error("get by-userID error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
