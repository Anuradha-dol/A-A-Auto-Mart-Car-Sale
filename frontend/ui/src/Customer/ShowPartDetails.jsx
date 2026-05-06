import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Showparts.css";

export default function PartDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/vehicleparts/${id}`);
        setPart(res.data);
        setTotalPrice(res.data.price); // initial total price = single unit price
      } catch (err) {
        console.error("Error fetching part:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  // Update total price whenever quantity changes
  useEffect(() => {
    if (part) {
      setTotalPrice((part.price * quantity).toFixed(2));
    }
  }, [quantity, part]);

  const handleAddToCart = async () => {
    const payload = {
      user: user.id,
      userID: user.userID,
      parts: [{ _id: part._id, quantity }],
      vehicles: [],
      notes: "Added from website cart",
    };

    if (!user || !user.id) {
      alert("Please login first!");
      return;
    }

    if (!part || !part._id) {
      alert("Part info is missing. Cannot add to cart.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/orders", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Part added to cart successfully!");
      navigate("/cartPage");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert("Failed to add part to cart");
    }
  };

  if (loading) return <p className="pd-loading">Loading part details...</p>;
  if (!part) return <p className="pd-loading">Part not found!</p>;

  return (
    <div className="pd-card">
      <h2 className="pd-title">{part.name} ({part.model})</h2>
      <img
        src={part.image ? `http://localhost:3000/uploads/${part.image}` : "https://via.placeholder.com/400x300"}
        alt={part.name}
        className="pd-image"
      />

      <div className="pd-info">
        <p><strong>Part ID:</strong> {part.partID}</p>
        <p><strong>Type:</strong> {part.type}</p>
        <p><strong>Brand:</strong> {part.brand}</p>
        <p><strong>Available Quantity:</strong> {part.quantity}</p>
        <p><strong>Price per unit:</strong> ${part.price}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
        <p>
          <strong>Status:</strong> 
          <span className={`pd-status ${part.status.replace(/\s/g,'')}`}>{part.status}</span>
        </p>
      </div>

      <div className="pd-quantity">
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            max={part.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(Number(e.target.value), part.quantity))}
          />
        </label>
      </div>

      <div className="pd-buttons">
        <button className="btn-add-cart" onClick={handleAddToCart}>Add to Cart</button>
        <Link to="/customersidevehiclepart">
          <button className="btn-back">Back to Parts List</button>
        </Link>
      </div>
    </div>
  );
}
