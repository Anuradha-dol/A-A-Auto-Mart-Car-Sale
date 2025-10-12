import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateLeaveForm.css";
export default function UpdateLeaveRequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  const API = "http://localhost:3000/api/levave";

  // fetch leave request data
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setForm({
          reason: res.data.reason,
          startDate: res.data.startDate.slice(0, 10),
          endDate: res.data.endDate.slice(0, 10),
          status: res.data.status,
        });
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch leave request");
      }
    };
    fetchLeave();
  }, [id]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${id}`, form);
      alert("✅ Leave request updated successfully!");
      navigate("/leave-dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update leave request.");
    }
  };

  return (
    <div className="leave-form-wrapper">
      <h2 className="leave-form-title">Update Leave Request</h2>
      <form onSubmit={handleSubmit} className="leave-form">
        <div className="leave-field">
          <label>Reason</label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
          />
        </div>
        <div className="leave-field">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="leave-field">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="leave-field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button type="submit" className="leave-btn">Update Leave</button>
      </form>
    </div>
  );
}
