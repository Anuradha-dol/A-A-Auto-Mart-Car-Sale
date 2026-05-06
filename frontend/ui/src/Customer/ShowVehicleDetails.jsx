import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ShowVehicleDetails.css"; 

const ShowVehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/cars/${id}`);
        setVehicle(res.data);
      } catch (err) {
        console.error(err);
        setVehicle(null);
      }
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user || !user.id) {
      alert("Please login first!");
      return;
    }
    if (!vehicle || !vehicle._id) {
      alert("Vehicle info is missing.");
      return;
    }

    const payload = {
      user: user.id,
      userID: user.userID,
      parts: [],
      vehicles: [{ _id: vehicle._id }],
      notes: "Added vehicle from website cart",
    };

    try {
      await axios.post("http://localhost:3000/api/orders", payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Vehicle added to cart successfully!");
      navigate("/cartPage");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert("Failed to add vehicle to cart");
    }
  };

  if (loading) return <p className="svd-loading">Loading vehicle details...</p>;
  if (!vehicle) return <p className="svd-loading">Vehicle not found!</p>;

  return (
    <div className="svd-container">
      <div className="svd-card">
        {vehicle.image && (
          <img
            src={`http://localhost:3000/uploads/${vehicle.image}`}
            alt={vehicle.name}
            className="svd-image"
          />
        )}

        <div className="svd-info">
          <h2>{vehicle.name} ({vehicle.model})</h2>
          <p><strong>Vehicle ID:</strong> {vehicle.vehicleID}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>
          <p><strong>Brand:</strong> {vehicle.brand}</p>
          <p><strong>Year:</strong> {vehicle.year}</p>
          <p><strong>Price:</strong> ${vehicle.price}</p>
          <p><strong>Status:</strong> {vehicle.status}</p>
        </div>

        <div className="svd-actions">
          <Link to="/customer-dashboard" className="svd-btn secondary-btn">Back to List</Link>
          <button onClick={handleAddToCart} className="svd-btn primary-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ShowVehicleDetails;
