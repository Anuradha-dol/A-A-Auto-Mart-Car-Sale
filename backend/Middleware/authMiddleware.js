const express = require("express");
const router = express.Router();
const User = require("../model/users");
const verifyToken = require("../middleware/verifyToken");

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded; // {id, role}
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
