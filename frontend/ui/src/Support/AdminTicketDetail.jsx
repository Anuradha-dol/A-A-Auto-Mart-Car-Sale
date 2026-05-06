// src/Support/AdminTicketDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AdminStyles.css";

export default function AdminTicketDetail() {
  const { id } = useParams();
  const API = "http://localhost:3000/api";

  // ---- robust role normalization (matches the rest of your app) ----
  const rawRole = (localStorage.getItem("role") || "customer").trim();
  // e.g. "Support Manager" -> "supportmanager"
  const roleKey = rawRole.toLowerCase().replace(/[\s_-]/g, "");
  const isSupport =
    roleKey === "supportmanager" || roleKey === "customercareofficer";

  const userId = (localStorage.getItem("userId") || "").trim();

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // reply/send allowed only for support staff
  const canReply = useMemo(() => isSupport, [isSupport]);

  useEffect(() => {
    let alive = true;

    const loadTicket = async () => {
      setLoading(true);
      setLoadError("");
      try {
        // 1) Ticket
        const tRes = await axios.get(`${API}/tickets/${encodeURIComponent(id)}`, {
          params: { role: rawRole, userId },
        });
        if (!alive) return;
        setTicket(tRes.data.ticket);

        // 2) Replies (non-fatal if it fails)
        try {
          const rRes = await axios.get(`${API}/reply/ticket/${encodeURIComponent(id)}`, {
            params: { role: rawRole, userId },
          });
          if (!alive) return;
          const sorted = (rRes.data.replies || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setReplies(sorted);
        } catch (repliesErr) {
          console.warn("Replies fetch failed:", repliesErr?.response?.data || repliesErr.message);
          if (alive) setReplies([]);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch ticket";
        if (alive) setLoadError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadTicket();
    return () => {
      alive = false;
    };
  }, [API, id, rawRole, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !canReply) return;

    try {
      const res = await axios.post(
        `${API}/reply`,
        { ticketId: id, message },
        { params: { role: rawRole, userId } }
      );

      // Optionally set status to Answered
      try {
        await axios.put(
          `${API}/tickets/${id}`,
          { status: "Answered" },
          { params: { role: rawRole, userId } }
        );
        setTicket((prev) => (prev ? { ...prev, status: "Answered" } : prev));
      } catch (upErr) {
        console.warn("Status update failed:", upErr?.response?.data || upErr.message);
      }

      setReplies((prev) => [res.data.reply, ...prev]);
      setMessage("");
    } catch (err) {
      console.error("Reply error:", err);
      alert(err.response?.data?.message || "Failed to send reply");
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!canReply) return;
    if (!window.confirm("Delete this reply?")) return;
    try {
      await axios.delete(`${API}/reply/${replyId}`, {
        params: { role: rawRole, userId },
      });
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
    } catch (err) {
      console.error("Delete reply error:", err);
      alert(err.response?.data?.message || "Failed to delete reply");
    }
  };

  const startEdit = (reply) => {
    if (!canReply) return;
    setEditingId(reply._id);
    setEditText(reply.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdateReply = async (replyId) => {
    if (!canReply || !editText.trim()) return;
    try {
      const res = await axios.put(
        `${API}/reply/${replyId}`,
        { message: editText },
        { params: { role: rawRole, userId } }
      );
      setReplies((prev) =>
        prev.map((r) => (r._id === replyId ? { ...r, message: res.data.reply.message } : r))
      );
      cancelEdit();
    } catch (err) {
      console.error("Update reply error:", err);
      alert(err.response?.data?.message || "Failed to update reply");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (loadError) return <p style={{ padding: 20, color: "#b91c1c" }}>{loadError}</p>;
  if (!ticket) return <p style={{ padding: 20 }}>Ticket not found.</p>;

  return (
    <div className="page-container">
      <div className="ticket-card">
        <h2>{ticket.subject}</h2>
        <div className="ticket-info">
          <p><strong>Name:</strong> {ticket.name}</p>
          <p><strong>Email:</strong> {ticket.email}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
        </div>
      </div>

      <h3>Replies</h3>
      <ul className="replies-list">
        {replies.map((r) => (
          <li key={r._id}>
            {editingId === r._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  style={{ width: "100%", marginBottom: 6 }}
                />
                {isSupport && (
                  <>
                    <button onClick={() => handleUpdateReply(r._id)}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: 6, background: "gray" }}>
                      Cancel
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <strong>{r.senderRole}:</strong> {r.message}
                <span style={{ fontSize: "0.8em", color: "#6b7280" }}>
                  {" "}{new Date(r.createdAt).toLocaleString()}
                </span>
                {isSupport && (
                  <>
                    <button
                      style={{ marginLeft: 10, padding: "2px 6px", fontSize: "0.75rem" }}
                      onClick={() => startEdit(r)}
                    >
                      Update
                    </button>
                    <button
                      style={{ marginLeft: 6, padding: "2px 6px", fontSize: "0.75rem", background: "crimson", color: "#fff" }}
                      onClick={() => handleDeleteReply(r._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {isSupport && (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type your reply..."
            required
          />
          <button type="submit" style={{ marginTop: 10 }}>
            Send Reply
          </button>
        </form>
      )}
    </div>
  );
}
