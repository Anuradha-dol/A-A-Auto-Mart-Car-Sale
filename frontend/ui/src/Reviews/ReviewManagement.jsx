// src/pages/ReviewManagement.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const INITIAL_FORM = {
  name: "",
  gmail: "",
  description: "",
  rating: 0,          // your backend allows 0–5
  sentiment: "",      // optional
  keywordsText: "",   // UI-only, becomes keywords[]
};

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [fieldErrs, setFieldErrs] = useState({}); // {name,gmail,description,rating}

  // filters
  const [q, setQ] = useState("");
  const [sentiment, setSentiment] = useState("");

  const baseURL = "http://localhost:3000/api/reviews";

  const keywordsArray = useMemo(() => {
    return form.keywordsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [form.keywordsText]);

  const resetErrors = () => {
    setErrMsg("");
    setFieldErrs({});
  };

  const load = async () => {
    setLoading(true);
    resetErrors();
    try {
      const res = await axios.get(baseURL, {
        params: {
          ...(q.trim() ? { q: q.trim() } : {}),
          ...(sentiment.trim() ? { sentiment: sentiment.trim() } : {}),
        },
      });
      // backend returns { Reviews: [...] }
      setReviews(res.data?.Reviews || []);
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  const onSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    setSaving(true);

    const payload = {
      name: form.name,
      gmail: form.gmail,
      description: form.description,
      rating: Number(form.rating),
      ...(form.sentiment ? { sentiment: form.sentiment } : {}),
      ...(keywordsArray.length ? { keywords: keywordsArray } : {}),
    };

    try {
      if (editingId) {
        // PUT returns { review }
        await axios.put(`${baseURL}/${editingId}`, payload);
      } else {
        // POST returns the created document directly
        await axios.post(baseURL, payload);
      }

      setForm(INITIAL_FORM);
      setEditingId(null);
      await load();
    } catch (e) {
      // handle 400 field validation
      const data = e.response?.data;
      if (data && typeof data === "object" && !data.message) {
        setFieldErrs(data);
      } else {
        setErrMsg(data?.message || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (r) => {
    setEditingId(r._id);
    setForm({
      name: r.name || "",
      gmail: r.gmail || "",
      description: r.description || "",
      rating: r.rating ?? 0,
      sentiment: r.sentiment || "",
      keywordsText: Array.isArray(r.keywords) ? r.keywords.join(", ") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    resetErrors();
    try {
      await axios.delete(`${baseURL}/${id}`);
      await load();
    } catch (e) {
      setErrMsg(e.response?.data?.message || "Delete failed");
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    resetErrors();
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Review Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Search by name/email/description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              width: 280,
            }}
          />
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
          >
            <option value="">All sentiments</option>
            <option value="positive">positive</option>
            <option value="neutral">neutral</option>
            <option value="negative">negative</option>
          </select>
          <button
            onClick={load}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      </header>

      {/* Form */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Review" : "Create Review"}</h3>

        {errMsg ? (
          <div style={{ color: "#b91c1c", marginBottom: 10 }}>{errMsg}</div>
        ) : null}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <div>
            <input
              placeholder="Customer name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            {fieldErrs.name && <FieldError text={fieldErrs.name} />}
          </div>

          <div>
            <input
              placeholder="Customer email"
              type="email"
              value={form.gmail}
              onChange={(e) => setForm({ ...form, gmail: e.target.value })}
              style={inputStyle}
            />
            {fieldErrs.gmail && <FieldError text={fieldErrs.gmail} />}
          </div>

          <div>
            <textarea
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {fieldErrs.description && <FieldError text={fieldErrs.description} />}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 160 }}>
              <label style={labelStyle}>Rating (0–5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                style={inputStyle}
              />
              {fieldErrs.rating && <FieldError text={fieldErrs.rating} />}
            </div>

            <div style={{ minWidth: 160 }}>
              <label style={labelStyle}>Sentiment (optional)</label>
              <select
                value={form.sentiment}
                onChange={(e) => setForm({ ...form, sentiment: e.target.value })}
                style={inputStyle}
              >
                <option value="">—</option>
                <option value="positive">positive</option>
                <option value="neutral">neutral</option>
                <option value="negative">negative</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: 240 }}>
              <label style={labelStyle}>Keywords (comma separated)</label>
              <input
                placeholder="e.g., quick service, helpful staff"
                value={form.keywordsText}
                onChange={(e) => setForm({ ...form, keywordsText: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: "pointer",
                opacity: saving ? 0.8 : 1,
              }}
            >
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={onCancelEdit}
                style={{
                  background: "#e5e7eb",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  padding: "10px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Table */}
      <section
        style={{
          background: "#ffffff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>All Reviews</h3>

        {loading ? (
          <div style={{ padding: 12 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <Th>Customer</Th>
                  <Th>Email</Th>
                  <Th>Rating</Th>
                  <Th>Sentiment</Th>
                  <Th>Description</Th>
                  <Th>Keywords</Th>
                  <Th style={{ textAlign: "center" }}>Action</Th>
                </tr>
              </thead>
              <tbody>
                {reviews.length ? (
                  reviews.map((r) => (
                    <tr key={r._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <Td>{r.name}</Td>
                      <Td>{r.gmail}</Td>
                      <Td>{r.rating}</Td>
                      <Td>{r.sentiment || "—"}</Td>
                      <Td style={{ maxWidth: 420 }}>{r.description}</Td>
                      <Td>
                        {Array.isArray(r.keywords) && r.keywords.length
                          ? r.keywords.join(", ")
                          : "—"}
                      </Td>
                      <Td center>
                        <button
                          onClick={() => onEdit(r)}
                          style={editBtn}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(r._id)}
                          style={delBtn}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "#6b7280",
  marginBottom: 6,
};

const Th = ({ children, style }) => (
  <th
    style={{
      textAlign: "left",
      padding: 10,
      fontWeight: 600,
      color: "#111827",
      ...style,
    }}
  >
    {children}
  </th>
);

const Td = ({ children, center, style }) => (
  <td
    style={{
      padding: 10,
      verticalAlign: "top",
      textAlign: center ? "center" : "left",
      ...style,
    }}
  >
    {children}
  </td>
);

const FieldError = ({ text }) => (
  <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 4 }}>{String(text)}</div>
);

const editBtn = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  marginRight: 6,
  cursor: "pointer",
};

const delBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
