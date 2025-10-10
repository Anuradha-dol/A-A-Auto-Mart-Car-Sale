import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PaymentManagerDashboard.css";

export default function PaymentManagerDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/payment");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.status?.toLowerCase().includes(search.toLowerCase()) ||
      p.order?._id?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalPayments = payments.length;
  const completedPayments = payments.filter((p) => p.status === "Completed").length;
  const pendingPayments = payments.filter((p) => p.status === "Pending").length;
  const failedPayments = payments.filter((p) => p.status === "Failed").length;

  if (loading) return <p>Loading payments...</p>;
  if (!payments.length) return <p>No payment records found.</p>;

  return (
    <div className="pm-dashboard">
      {/* Top bar */}
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
      <header className="pm-header">
        <h1>💳 Payment Manager Dashboard</h1>
        <p className="subtitle">Manage all payment transactions</p>
      </header>

      {/* Stats */}
      <section className="pm-stats">
        <div className="stat-card">
          <h2>{totalPayments}</h2>
          <p>Total Payments</p>
        </div>
        <div className="stat-card">
          <h2>{completedPayments}</h2>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h2>{pendingPayments}</h2>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h2>{failedPayments}</h2>
          <p>Failed</p>
        </div>
      </section>

      {/* Actions */}
      <div className="pm-actions">
        <input
          type="text"
          placeholder="🔍 Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn action-btn" onClick={fetchPayments}>
          ⟳ Refresh
        </button>
        <button className="btn action-btn" onClick={() => navigate("/request-leave")}>
          + Add Leave
        </button>
        <button className="btn action-btn" onClick={() => navigate("/SalaryList")}>
          + View Salary
        </button>
      </div>

      {/* Payment Table */}
      <div className="pm-table-container">
        <table className="pm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Slip</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((p) => (
                <tr key={p._id}>
                  <td>{p.order?._id || "-"}</td>
                  <td>{p.user?.name || "Unknown"}</td>
                  <td>${p.amount}</td>
                  <td
                    style={{
                      color:
                        p.status === "Completed"
                          ? "green"
                          : p.status === "Pending"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {p.status}
                  </td>
                  <td>{p.notes || "-"}</td>
                  <td>
                    {p.slipImage ? (
                      <img
                        src={`http://localhost:3000/uploads/payments/${p.slipImage}`}
                        alt="Slip"
                        className="slip-img"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn edit"
                      onClick={() => navigate(`/paymentManagerSideShowPayment/${p._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-records">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
