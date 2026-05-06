import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VehiclePartManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:3000/api/tik";

  // Fetch all vehicle part requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(API);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicle part requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve or reject a request
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/${id}`, { status });
      alert(`Request ${status.toLowerCase()} successfully!`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to update request status");
    }
  };

  // Delete a request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("Request deleted successfully!");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Failed to delete request");
    }
  };

  // Navigate to update form page
  const handleUpdate = (id) => {
    navigate(`/updateVehicleRequest/${id}`);
  };

  return (
    <div className="manager-dashboard">
      <h2>All Vehicle Part Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Part Number</th>
              <th>Quantity</th>
              <th>Request Date</th>
              <th>Needed By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.partName}</td>
                <td>{req.partNumber || "-"}</td>
                <td>{req.quantity}</td>
                <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                <td>{new Date(req.neededByDate).toLocaleDateString()}</td>
                <td>{req.status}</td>
                <td>
                 
                  <button onClick={() => handleUpdate(req._id)}>Update</button>
                  <button onClick={() => handleDelete(req._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
