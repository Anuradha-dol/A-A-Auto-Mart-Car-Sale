import React from "react";
import { useNavigate } from "react-router-dom";
import "./VehiclePartCard.css";

export default function VehiclePartCard({ part, handleDelete }) {
  const navigate = useNavigate();

  return (
    <div className="vpc-card">
      <img
        src={part.image ? `http://localhost:3000/uploads/${part.image}` : "/placeholder.png"}
        alt={part.name}
        className="vpc-image"
      />
      <div className="vpc-info">
        <h3 className="vpc-title">{part.name}</h3>
        <p><strong>ID:</strong> {part.partID}</p>
        <p><strong>Type:</strong> {part.type}</p>
        <p><strong>Brand:</strong> {part.brand}</p>
        <p><strong>Price:</strong> ${part.price}</p>
        <p><strong>Stock:</strong> {part.stock}</p>
        <p><strong>Status:</strong> {part.status}</p>
      </div>
      <div className="vpc-actions">
        <button
          onClick={() => navigate(`/updatevehiclepart/${part._id}`)}
          className="vpc-btn vpc-edit-btn"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(part._id)}
          className="vpc-btn vpc-delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
