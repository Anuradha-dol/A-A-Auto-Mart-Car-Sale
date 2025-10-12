import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./UserManagerDashboard.css";

export default function UserManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        alert("User deleted successfully!");
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Error deleting user");
      }
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("users-table-pdf");
    element.style.display = "block";

    html2canvas(element, { scale: 2, useCORS: true, allowTaint: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("users_details.pdf");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        alert("Failed to generate PDF.");
      })
      .finally(() => {
        element.style.display = "none";
      });
  };

  return (
    <div className="um-dashboard">
      {/* Header */}
      <header className="um-header">
        <h1>User Manager Dashboard</h1>
        <p className="subtitle">Welcome, {user.name} 👋 Manage all platform users</p>

        <div className="um-header-actions">
          <button className="profile-btn" onClick={() => navigate("/userProfile")}>
            👤 View Profile
          </button>
          <button className="secondary-btn" onClick={() => navigate("/request-leave")}>
            ➕ Add Leave
          </button>
          <button className="secondary-btn" onClick={() => navigate("/SalaryList")}>
            💰 View Salary
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="um-stats">
        {[
          "Total",
          "customer",
          "manager",
          "EmployeeManager",
          "PaymentManager",
          "UserManager",
          "VehicleMechanic",
          "VehiclePartsManager",
          "CustomerCareOfficer",
        ].map((role) => (
          <div className="stat-card" key={role}>
            <h2>{role === "Total" ? users.length : users.filter((u) => u.role === role).length}</h2>
            <p>{role === "Total" ? "Total Users" : role}</p>
          </div>
        ))}
      </section>

      {/* Search & Actions */}
      <div className="um-actions">
        <input
          type="text"
          placeholder="🔍 Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn info" onClick={fetchUsers}>⟳ Refresh</button>
        <button className="btn secondary" onClick={() => navigate("/Addusers")}>➕ Add User</button>
        <button className="btn info" onClick={downloadPDF}>📄 Download PDF</button>
      </div>

      {/* User Table */}
      <div className="um-table-container">
        <table className="um-table" id="users-table-pdf">
          <thead>
            <tr>
              <th>UserID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.userID}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td>{u.phone}</td>
                  <td>{u.address}</td>
                  <td>
                    <button className="btn danger" onClick={() => handleDelete(u._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
