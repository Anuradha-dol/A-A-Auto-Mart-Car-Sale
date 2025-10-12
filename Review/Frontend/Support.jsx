// src/Support/Support.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Support.css";

const API = "http://localhost:3000/api";

export default function Support() {
  // ---- auth from login ----
  const rawRole = (localStorage.getItem("role") || "customer").trim();
  const userId = (localStorage.getItem("userId") || "").trim();

  // normalize CustomerCareOfficer → Support_Manager
  const normalizeRole = (r) =>
    r === "CustomerCareOfficer" ? "Support_Manager" : r || "customer";
  const role = normalizeRole(rawRole);

  // convenience keys
  const roleKey = role.toLowerCase().replace(/[\s_-]/g, "");
  const isSupport =
    roleKey === "supportmanager" || roleKey === "customercareofficer";
  const isAdminViewer = ["manager", "usermanager", "employeemanager"].includes(
    roleKey
  );
  const isOwner = (t) => String(t.userId) === String(userId);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    priority: "Low",
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState(""); // used only by support
  const [wordCount, setWordCount] = useState(0);
  const [search, setSearch] = useState("");

  // ---------- fetch ----------
  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/tickets`, { params: { role, userId } });
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId]);

  // ---------- drafts ----------
  useEffect(() => {
    const draft = localStorage.getItem("support-draft");
    if (draft) setFormData(JSON.parse(draft));
  }, []);
  useEffect(() => {
    if (showForm) {
      localStorage.setItem("support-draft", JSON.stringify(formData));
    }
  }, [formData, showForm]);

  // ---------- validation ----------
  const validateField = (name, value) => {
    let msg = "";
    switch (name) {
      case "name":
        if (!value.trim()) msg = "Name is required";
        else if (!/^[a-zA-Z\s]{2,50}$/.test(value))
          msg = "Name must be 2–50 letters/spaces only";
        break;
      case "email":
        if (!value.trim()) msg = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          msg = "Invalid email format";
        else if (!/\.(com|net)$/i.test(value))
          msg = "Email must end with .com or .net";
        break;
      case "subject":
        if (!value.trim()) msg = "Subject is required";
        else if (value.trim().length < 3)
          msg = "Subject must be at least 3 characters";
        else if (!/^[\w\s-]+$/.test(value))
          msg = "Only letters, numbers, space and - allowed";
        else if (
          tickets.some(
            (t) =>
              t.subject?.toLowerCase() === value.trim().toLowerCase() &&
              t._id !== editId
          )
        )
          msg = "A ticket with this subject already exists";
        break;
      case "description":
        if (!value.trim()) msg = "Description is required";
        else if (value.trim().length < 20)
          msg = "Description must be at least 20 characters";
        else if (value.length > 1000)
          msg = "Description cannot exceed 1000 characters";
        else {
          const words = value.toLowerCase().split(/\s+/);
          const counts = {};
          for (const w of words) counts[w] = (counts[w] || 0) + 1;
          if (Object.values(counts).some((c) => c > 3))
            msg = "Avoid repeating the same word more than 3 times";
        }
        break;
      case "priority":
        if (!["Low", "Medium", "High"].includes(value))
          msg = "Priority must be Low, Medium or High";
        break;
      default:
        break;
    }
    return msg;
  };

  const validateAll = () => {
    const newErrors = {};
    ["name", "email", "subject", "description", "priority"].forEach((f) => {
      const e = validateField(f, formData[f]);
      if (e) newErrors[f] = e;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- form helpers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
    if (name === "description") {
      setWordCount(value.trim() === "" ? 0 : value.trim().split(/\s+/).length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      if (editId) {
        await axios.put(`${API}/tickets/${editId}`, formData, {
          params: { role, userId },
        });
        alert("Ticket updated!");
      } else {
        await axios.post(`${API}/tickets`, {
          userId,
          ...formData,
          status: "Open",
        });
        alert("Ticket created!");
      }
      resetForm();
      fetchTickets();
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${API}/tickets/${id}`, { params: { role, userId } });
      setTickets((p) => p.filter((t) => t._id !== id));
      if (selectedTicket?._id === id) {
        setSelectedTicket(null);
        setReplies([]);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const startEdit = (ticket) => {
    setFormData({
      name: ticket.name || "",
      email: ticket.email || "",
      subject: ticket.subject || "",
      description: ticket.description || "",
      priority: ticket.priority || "Low",
    });
    setErrors({});
    setEditId(ticket._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      description: "",
      priority: "Low",
    });
    setErrors({});
    setEditId(null);
    setShowForm(false);
    localStorage.removeItem("support-draft");
    setWordCount(0);
  };

  // ---------- client-side ownership filter ----------
  // Even though backend enforces it, we also filter on the client
  const visibleTickets = useMemo(() => {
    if (isSupport) return tickets; // support sees all
    // non-support: only own tickets
    return tickets.filter((t) => String(t.userId) === String(userId));
  }, [tickets, isSupport, userId]);

  // ---------- search over visible tickets ----------
  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = visibleTickets;
    if (!q) return base;
    return base.filter((t) => {
      const fields = [t._id, t.name, t.email, t.subject, t.priority, t.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return fields.includes(q);
    });
  }, [visibleTickets, search]);

  // ---------- ticket open / replies ----------
  const openTicket = async (ticket) => {
    // safety: only owner or support can open
    if (!(isSupport || isOwner(ticket))) return;

    setSelectedTicket(ticket);
    setReplyText("");
    try {
      await axios.put(
        `${API}/reply/mark-read/${ticket._id}`,
        {},
        { params: { role, userId } }
      );
      const res = await axios.get(`${API}/reply/ticket/${ticket._id}`, {
        params: { role, userId },
      });
      setReplies(res.data.replies || []);
      fetchTickets();
    } catch (err) {
      console.error("Open ticket error:", err);
    }
  };

  // ---------- support reply only ----------
  const sendReply = async () => {
    if (!selectedTicket || !isSupport) return; // customers cannot reply
    const text = replyText.trim();
    if (!text) return;

    try {
      const resp = await axios.post(
        `${API}/reply`,
        { ticketId: selectedTicket._id, message: text },
        { params: { role, userId } }
      );
      setReplies((prev) => [...prev, resp.data.reply]);
      setReplyText("");
      fetchTickets();
    } catch (err) {
      console.error("Send reply error:", err);
      alert("Failed to send reply");
    }
  };

  // ---------- helpers for table ----------
  const renderHeaderLastCol = () => {
    if (isSupport) return <th style={{ width: "160px" }}>Actions</th>;
    if (isAdminViewer) return <th style={{ minWidth: "160px" }}>Answered At</th>;
    return <th style={{ width: "160px" }}>Actions</th>;
  };

  const ActionsCell = ({ t }) => (
    <td onClick={(e) => e.stopPropagation()}>
      {(isSupport || isOwner(t)) && (
        <div className="actions">
          <button
            className="action-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(t);
            }}
          >
            Edit
          </button>
          <button
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(t._id);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </td>
  );

  const renderRowLastCol = (t) => {
    if (isSupport) return <ActionsCell t={t} />;
    if (isAdminViewer) {
      return (
        <td>{t.answeredAt ? new Date(t.answeredAt).toLocaleString() : "—"}</td>
      );
    }
    return <ActionsCell t={t} />;
  };

  const headerCols = 6;

  // Customers only see Support replies in history
  const visibleReplies = useMemo(() => {
    if (isSupport) return replies;
    return replies.filter(
      (r) => (r.senderRole || "").toLowerCase() !== "customer"
    );
  }, [replies, isSupport]);

  return (
    <div className="support-container">
      {!showForm && (
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, email, subject, status…"
            />
          </div>
          <div className="toolbar-right">
            <button className="add-ticket-btn" onClick={() => setShowForm(true)}>
              + Add New Ticket
            </button>
          </div>
        </div>
      )}

      <table className="ticket-table">
        <thead>
          <tr>
            <th style={{ minWidth: "220px" }}>ID</th>
            <th>Customer Name</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            {renderHeaderLastCol()}
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((t) => (
              <tr
                key={t._id}
                onClick={() => openTicket(t)}
                className={selectedTicket?._id === t._id ? "selected" : ""}
              >
                <td>{t._id}</td>
                <td>{t.name}</td>
                <td>{t.subject}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                {renderRowLastCol(t)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headerCols} style={{ textAlign: "center" }}>
                No tickets yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal ticket-detail-modal">
            <h3>Ticket Details</h3>
            <p><strong>ID:</strong> {selectedTicket._id}</p>
            <p><strong>Name:</strong> {selectedTicket.name}</p>
            <p><strong>Email:</strong> {selectedTicket.email}</p>
            <p><strong>Subject:</strong> {selectedTicket.subject}</p>
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Priority:</strong> {selectedTicket.priority}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            {selectedTicket.createdAt && (
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedTicket.createdAt).toLocaleString()}
              </p>
            )}
            {selectedTicket.answeredAt && (
              <p>
                <strong>Answered At:</strong>{" "}
                {new Date(selectedTicket.answeredAt).toLocaleString()}
              </p>
            )}

            <h4 style={{ marginTop: 20 }}>Replies</h4>
            {visibleReplies.length > 0 ? (
              <ul className="replies-list">
                {visibleReplies.map((r) => (
                  <li key={r._id}>
                    <strong>{r.senderRole}:</strong> {r.message}
                    <span style={{ fontSize: "0.8em", color: "#aaa" }}>
                      {" "}({new Date(r.createdAt).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No replies yet.</p>
            )}

            {/* Composer is shown ONLY for support; customers never see it */}
            {isSupport && (
              <div className="reply-composer">
                <textarea
                  rows={3}
                  placeholder={
                    selectedTicket.status === "Open"
                      ? "Write a reply to the customer…"
                      : "Ticket is not Open — replying is disabled"
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={selectedTicket.status !== "Open"}
                />
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    className="submit-btn"
                    onClick={sendReply}
                    disabled={
                      selectedTicket.status !== "Open" || !replyText.trim()
                    }
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}

            <button
              className="close-details"
              onClick={() => {
                setSelectedTicket(null);
                setReplies([]);
                setReplyText("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Ticket Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? "Update Ticket" : "Submit a New Ticket"}</h3>
            <form className="support-form" onSubmit={handleSubmit} noValidate>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
              {errors.subject && (
                <span className="error-text">{errors.subject}</span>
              )}

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue"
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
              <p
                style={{
                  fontSize: "0.8em",
                  color: wordCount < 20 ? "orange" : "#aaa",
                }}
              >
                Word Count: {wordCount}
              </p>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              {errors.priority && (
                <span className="error-text">{errors.priority}</span>
              )}

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


