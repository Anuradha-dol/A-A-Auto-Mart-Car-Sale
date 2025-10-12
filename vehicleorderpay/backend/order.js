const express = require("express");
const mongoose = require("mongoose");
const Order = require("../model/order");
const Part = require("../model/vehiclePart");
const Vehicle = require("../model/vehicle");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { user, userID, parts, vehicles, notes } = req.body;

    if (!user) return res.status(400).json({ message: "User ID is required" });
    if (!mongoose.Types.ObjectId.isValid(user))
      return res.status(400).json({ message: "Invalid user ObjectId" });

    const userObjectId = new mongoose.Types.ObjectId(user);

   
    const orderedParts = Array.isArray(parts)
      ? await Promise.all(
          parts.map(async (p) => {
            const part = await Part.findById(p._id);
            if (!part) throw new Error(`Invalid part ID: ${p._id}`);
            return {
              partID: part.partID,
              name: part.name,
              type: part.type,
              brand: part.brand,
              model: part.model,
              price: part.price,
              quantity: p.quantity,
              image: part.image,
              userID,
              user: userObjectId,
            };
          })
        )
      : [];

      

    
    const orderedVehicles = Array.isArray(vehicles)
      ? await Promise.all(
          vehicles.map(async (v) => {
            const vehicle = await Vehicle.findById(v._id);
            if (!vehicle) throw new Error(`Invalid vehicle ID: ${v._id}`);
            return {
              vehicleID: vehicle.vehicleID,
              name: vehicle.name,
              type: vehicle.type,
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              image: vehicle.image,
              userID,
              user: userObjectId,
            };
          })
        )
      : [];

    const total = orderedParts.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const newOrder = new Order({
      user: userObjectId,
      userID,
      notes,
      parts: orderedParts,
      vehicles: orderedVehicles,
      total,
      status: "Cart",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ message: "Missing user" });

    const orders = await Order.find({ user }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
