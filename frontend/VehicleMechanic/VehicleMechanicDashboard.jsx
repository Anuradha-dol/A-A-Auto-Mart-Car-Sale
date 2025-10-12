import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VehicleMechanicDashboard.css";

export default function VehicleMechanicDashboard() {
  const [user, setUser] = useState(null);
  const [works, setWorks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API = "http://localhost:3000/api/meca";

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return;
    setUser(savedUser);
    fetchWorks(savedUser);
  }, []);

  const fetchWorks = async (savedUser) => {
    try {
      const res = await axios.get(API);
      const myWorks = res.data.filter(
        (w) =>
          w.userID === savedUser.userID ||
          w.user === savedUser.id ||
          w.user?._id === savedUser.id
      );
      setWorks(myWorks);
    } catch (err) {
      console.error("Failed to fetch vehicle works:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work record?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setWorks((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete work.");
    }
  };

  const filteredWorks = works.filter(
    (w) =>
      w.vehicleDetails?.toLowerCase().includes(search.toLowerCase()) ||
      w.workDescription?.toLowerCase().includes(search.toLowerCase()) ||
      w.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return <p>No user logged in</p>;

  // Stats
  const totalWorks = works.length;
  const pendingWorks = works.filter((w) => w.status === "Pending").length;
  const inProcessWorks = works.filter((w) => w.status === "In Process").length;
  const completedWorks = works.filter((w) => w.status === "Completed").length;

  return (
    <div className="vm-dashboard">
      {/* Top bar: Profile + Logout */}
      <div className="top-bar">
        <button className="btn profile-btn" onClick={() => navigate("/userProfile")}>
          View Profile
        </button>
        <button
          className="btn logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Header */}
      <header className="vm-header">
        <h1>🛠️ Vehicle Mechanic Dashboard</h1>
        <p className="subtitle">Welcome, {user.name} 👋 Manage your vehicle works</p>
      </header>

      {/* Stats */}
      <section className="vm-stats">
        <div className="stat-card">
          <h2>{totalWorks}</h2>
          <p>Total Works</p>
        </div>
        <div className="stat-card">
          <h2>{pendingWorks}</h2>
          <p>Pending Works</p>
        </div>
        <div className="stat-card">
          <h2>{inProcessWorks}</h2>
          <p>In Process</p>
        </div>
        <div className="stat-card">
          <h2>{completedWorks}</h2>
          <p>Completed Works</p>
        </div>
      </section>

      {/* Actions */}
      <div className="vm-actions">
        <input
          type="text"
          placeholder="🔍 Search works..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn action-btn" onClick={() => fetchWorks(user)}>
          ⟳ Refresh
        </button>
        <button
          className="btn action-btn"
          onClick={() => navigate("/MyVehicleWorksfrom")}
        >
          ➕ Add Work
        </button>
        <button
          className="btn action-btn"
          onClick={() => navigate("/request-leave")}
        >
          + Add Leave
        </button>
        <button
          className="btn action-btn"
          onClick={() => navigate("/SalaryList")}
        >
          + View Salary
        </button>
      </div>

      {/* Table */}
      <div className="vm-table-container">
        <table className="vm-table">
          <thead>
            <tr>
              <th>Vehicle Details</th>
              <th>Work Description</th>
              <th>Parts Used</th>
              <th>Reported Date</th>
              <th>Expected Completion</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorks.length > 0 ? (
              filteredWorks.map((w) => (
                <tr key={w._id}>
                  <td>{w.vehicleDetails}</td>
                  <td>{w.workDescription}</td>
                  <td>
                    {w.partsUsed?.length > 0
                      ? w.partsUsed.map((p) => `${p.partName}(${p.quantity})`).join(", ")
                      : "-"}
                  </td>
                  <td>{new Date(w.reportedDate).toLocaleDateString()}</td>
                  <td>
                    {w.expectedCompletionDate
                      ? new Date(w.expectedCompletionDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td
                    style={{
                      color:
                        w.status === "Completed"
                          ? "green"
                          : w.status === "In Process"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {w.status}
                  </td>
                  <td className="actions">
                    <button
                      className="btn edit"
                      onClick={() => navigate(`/MyVehicleWorksUpdate/${w._id}`)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(w._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-works">
                  No vehicle works found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
