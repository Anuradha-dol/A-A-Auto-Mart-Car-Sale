import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateLeaveForm.css";

export default function UpdateLeaveForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api/levave";

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        const leave = res.data;
        setForm({
          reason: leave.reason,
          startDate: leave.startDate.slice(0, 10),
          endDate: leave.endDate.slice(0, 10),
          status: leave.status,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch leave details");
        setLoading(false);
      }
    };

    fetchLeave();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${id}`, form);
      alert("✅ Leave updated successfully!");
      navigate("/allLeavesDashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update leave.");
    }
  };

  if (loading) return <p>Loading leave details...</p>;

  return (
    <div className="update-leave-container">
      <h2>Update Leave Request</h2>
      <form className="update-leave-form" onSubmit={handleSubmit}>
        <div>
          <label>Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            readOnly
            rows={3}
          />
        </div>

        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            readOnly
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            readOnly
          />
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-update">
            Update Leave
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/allLeavesDashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
