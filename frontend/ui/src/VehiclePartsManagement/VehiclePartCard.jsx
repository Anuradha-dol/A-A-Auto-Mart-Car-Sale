import React from "react";
import { useNavigate } from "react-router-dom";
import "./VehiclePartCard.css"; // make sure to create this CSS similar to VehicleCard.css

export default function VehiclePartCard({ part, handleDelete }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/updatevehiclepart/${part._id}`);
  };

  return (
    <div className="vehicle-card">
      {/* Part Image */}
      <div className="vehicle-image">
        {part.image ? (
          <img
            src={`http://localhost:3000/uploads/${part.image}`}
            alt={part.name}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className={`badge ${part.status.toLowerCase()}`}>{part.status}</span>
      </div>

      {/* Part Info */}
      <div className="vehicle-info">
        <h3>{part.name}</h3>
        <p className="brand">{part.brand} | {part.type}</p>
        <p className="year">ID: {part.partID}</p>
        <p className="price">${Number(part.price).toLocaleString()}</p>
        <p className="year">Stock: {part.stock}</p>

        {/* Action Buttons */}
        <div className="vehicle-actions">
          <button className="btn-update" onClick={handleUpdate}>Update</button>
          <button className="btn-delete" onClick={() => handleDelete(part._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
