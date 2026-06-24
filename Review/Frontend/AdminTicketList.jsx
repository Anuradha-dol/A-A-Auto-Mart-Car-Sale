import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminStyles.css";

export default function AdminTicketList() {
  const [tickets, setTickets] = useState([]);

  // ---- Get logged-in role and userId from localStorage ----
  const rawRole = (localStorage.getItem("role") || "").trim();
  const userId = (localStorage.getItem("userId") || "").trim();

  // normalize role (CustomerCareOfficer → Support_Manager)
  const normalizeRole = (r) => {
    if (!r) return "customer";
    if (r === "CustomerCareOfficer") return "Support_Manager";
    return r;
  };
  const role = normalizeRole(rawRole);

  // fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/tickets", {
          params: { role, userId },
        });
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
    const interval = setInterval(fetchTickets, 10000); // auto refresh
    return () => clearInterval(interval);
  }, [role, userId]);

  return (
    <div className="page-container">
      <h2>Support Tickets</h2>

      <table className="ticket-table">
        <thead>
          <tr>
            <th style={{ minWidth: "220px" }}>ID</th>
            <th>Customer Name</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th style={{ width: "120px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <tr key={t._id}>
                <td>{t._id}</td>
                <td>{t.name}</td>
                <td>{t.subject}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>
                  <Link to={`/admin/tickets/${t._id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}



