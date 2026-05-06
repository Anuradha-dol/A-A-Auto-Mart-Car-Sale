import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateVehicleRequestStatus.css";

export default function UpdateVehicleRequestStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");
  const API = "http://localhost:3000/api/tik";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setStatus(res.data.status || "Pending");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch request status");
      }
    };
    fetchStatus();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${id}`, { status });
      alert(`✅ Request status updated to ${status}!`);
      navigate("/AllVehiclePartRequestsDashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update status");
    }
  };

  return (
    <div className="uvr-container">
      <form className="uvr-form" onSubmit={handleSubmit}>
        <h2 className="uvr-title">Update Request Status</h2>

        <div className="uvr-field">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button type="submit" className="uvr-btn">
          Update Status
        </button>
      </form>
    </div>
  );
}
