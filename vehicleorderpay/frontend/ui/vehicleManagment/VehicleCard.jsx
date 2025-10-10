import React from "react";
import { useNavigate } from "react-router-dom";

export default function VehicleCard({ vehicle, handleDelete }) {
  const navigate = useNavigate();

  const handleUpdate = () => {
   
    navigate(`/updatevehicle/${vehicle._id}`);
  };

  return (
    <div
      className="vehicle-card"
      style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
    >
      <h3>
        {vehicle.name} ({vehicle.model})
      </h3>
      <p>
        <strong>Type:</strong> {vehicle.type}
      </p>
      <p>
        <strong>Brand:</strong> {vehicle.brand}
      </p>
      <p>
        <strong>Year:</strong> {vehicle.year}
      </p>
      <p>
        <strong>Status:</strong> {vehicle.status}
      </p>
      <p>
        <strong>price:</strong> {vehicle.price}
      </p>
      {vehicle.image ? (
        <img
          src={`http://localhost:3000/uploads/${vehicle.image}`}
          alt={vehicle.name}
          style={{ width: "100px", height: "auto" }}
        />
      ) : (
        <p>No image available</p>
      )}
      <div style={{ marginTop: "10px" }}>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => handleDelete(vehicle._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
