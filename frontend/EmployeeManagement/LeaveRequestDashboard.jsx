import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeManagerDashboard() {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:3000/api/levave";

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(API);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch leave requests");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API}/${id}`, { status });
      alert(`Leave ${status.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to update leave status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("Leave deleted successfully!");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to delete leave request");
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updateRequestForm/${id}`);
  };

  return (
    <div className="manager-dashboard">
      <h2>All Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Reason</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave._id}>
                <td>{leave.employee.adminName}</td>
                <td>{leave.employee.email}</td>
                <td>{leave.reason}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === "Pending" && (
                    <>
                      <button onClick={() => handleStatusChange(leave._id, "Approved")}>Approve</button>
                      <button onClick={() => handleStatusChange(leave._id, "Rejected")}>Reject</button>
                    </>
                  )}
                  <button onClick={() => handleUpdate(leave._id)}>Update</button>
                  <button onClick={() => handleDelete(leave._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
