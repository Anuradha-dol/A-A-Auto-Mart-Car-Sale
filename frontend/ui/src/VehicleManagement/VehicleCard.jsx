import React from "react";
import { useNavigate } from "react-router-dom";
import "./VehicleCard.css";

export default function VehicleCard({ vehicle, handleDelete }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/updatevehicle/${vehicle._id}`);
  };

  return (
    <div className="vehicle-card">
      {/* Vehicle Image */}
      <div className="vehicle-image">
        {vehicle.image ? (
          <img
            src={`http://localhost:3000/uploads/${vehicle.image}`}
            alt={vehicle.name}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className={`badge ${vehicle.status.toLowerCase()}`}>{vehicle.status}</span>
      </div>

      {/* Vehicle Info */}
      <div className="vehicle-info">
        <h3>{vehicle.name} ({vehicle.model})</h3>
        <p className="brand">{vehicle.brand} | {vehicle.type}</p>
        <p className="year">Year: {vehicle.year}</p>
        <p className="price">${Number(vehicle.price).toLocaleString()}</p>

        {/* Action Buttons */}
        <div className="vehicle-actions">
          <button className="btn-update" onClick={handleUpdate}>Update</button>
          <button className="btn-delete" onClick={() => handleDelete(vehicle._id)}>Delete</button>
        </div>
        
      </div>
    </div>
  );
}
