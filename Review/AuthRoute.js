// Backend/Route/AuthRoute.js
const express = require("express");
const router = express.Router();
const User = require("../Model/User"); // your User model (user.js)

// POST /auth/login
// body: { email, password }
// returns: { user: { _id, name, email, role, userID } }
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    // NOTE: passwords are plain text in your model; compare directly
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Success → send minimal identity
    return res.json({
      user: {
        _id: user._id,
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

// (Optional) GET /auth/me?role=...&userId=...
// Returns the current user document (owner or admin only)
router.get("/me", async (req, res) => {
  try {
    const { role, userId } = req.query || {};
    if (!role || !userId) {
      return res.status(400).json({ message: "role and userId are required" });
    }

    // Only self or admin roles can fetch a user doc via this route
    const ADMIN = new Set(["manager", "UserManager"]);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!ADMIN.has(String(role)) && String(user._id) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ user });
  } catch (e) {
    console.error("Me error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
