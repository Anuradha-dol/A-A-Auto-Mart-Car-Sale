import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllLeavesDashboard.css";

export default function AllLeavesDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api/levave";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(API);

        // Filter out duplicates based on _id
        const uniqueLeaves = res.data.filter(
          (leave, index, self) =>
            index === self.findIndex((l) => l._id === leave._id)
        );

        setLeaves(uniqueLeaves);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleRespond = (leaveId) => {
    navigate(`/empManagerSideUpdateLeave/${leaveId}`);
  };

  if (loading) return <p className="loading-text">Loading leave requests...</p>;

  return (
    <div className="dashboard-container">
      <h2>📋 All Leave Requests</h2>

      {leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Reason</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.userID || "-"}</td>
                  <td>{leave.reason}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.status}</td>
                  <td>{new Date(leave.createdAt).toLocaleString()}</td>
                  <td>{new Date(leave.updatedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="respond-btn"
                      onClick={() => handleRespond(leave._id)}
                    >
                      Respond
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
