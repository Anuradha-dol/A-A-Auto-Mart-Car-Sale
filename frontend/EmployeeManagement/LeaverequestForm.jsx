import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeLeaveForm.css";

export default function EmployeeLeaveDashboard() {
  const [form, setForm] = useState({
    reason: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "17:00",
    user: "",
    userID: "",
  });

  const [myLeaves, setMyLeaves] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:3000/api/levave";

  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id;
  const currentUserCode = user?.userID;

  useEffect(() => {
    if (!currentId || !currentUserCode) {
      alert("User not logged in!");
      return;
    }

    setForm((prev) => ({
      ...prev,
      user: currentId,
      userID: currentUserCode,
    }));

    fetchMyLeaves();
  }, [currentId, currentUserCode]);

  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(API);
      const leaves = res.data.filter(
        (l) =>
          l.userID === currentUserCode ||
          l.user === currentId ||
          l.user?._id === currentId
      );
      setMyLeaves(leaves);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch leave requests");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDate = value;
    if (name === "startDate" || name === "endDate") {
      selectedDate = new Date(value);
      if (selectedDate < today) {
        alert("Selected date cannot be in the past.");
        return;
      }
    }

    // Validate time when start and end date are the same
    if (form.startDate && form.endDate) {
      const startDateObj = new Date(form.startDate);
      const endDateObj = new Date(name === "endDate" ? value : form.endDate);

      if (startDateObj.getTime() === endDateObj.getTime()) {
        const startParts = form.startTime.split(":");
        const endParts = name === "endTime" ? value.split(":") : form.endTime.split(":");

        const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        if (startMinutes === endMinutes) {
          alert("Start time and end time cannot be the same when dates are the same.");
          return;
        }

        if (endMinutes < startMinutes) {
          alert("End time cannot be before start time when dates are the same.");
          return;
        }
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId || !currentUserCode) return;

    if (!form.startDate || !form.endDate || !form.reason) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(API, {
        ...form,
        user: currentId,
        userID: currentUserCode,
      });

      alert("✅ Leave request submitted successfully!");
      setForm((prev) => ({
        ...prev,
        reason: "",
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "17:00",
      }));
      fetchMyLeaves();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit leave request.");
    }
  };

  const handleCancel = () => {
    navigate("/usermanager");
  };

  const handleRemoveLeave = async (leaveId) => {
    if (!window.confirm("Are you sure you want to remove this leave request?")) return;

    try {
      await axios.delete(`${API}/${leaveId}`);
      alert("✅ Leave request removed successfully!");
      fetchMyLeaves();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove leave request.");
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="leave-dashboard-container">
      <h2 className="leave-dashboard-header">Submit Leave Request</h2>

      <form onSubmit={handleSubmit} className="leave-form">
        <input type="hidden" name="user" value={form.user} />
        <input type="hidden" name="userID" value={form.userID} />

        <div className="leave-form-row">
          <label>Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            className="leave-textarea"
          />
        </div>

        <div className="leave-form-row">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            min={todayDate}
            required
            className="leave-input"
          />
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="leave-input"
          />
        </div>

        <div className="leave-form-row">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate || todayDate}
            required
            className="leave-input"
          />
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
            className="leave-input"
          />
        </div>

        <div className="leave-form-buttons">
          <button className="leave-submit-btn" type="submit">
            Submit
          </button>
          <button
            className="leave-cancel-btn"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      <h3 className="leave-my-requests-header">My Leave Requests</h3>
      {myLeaves.length === 0 ? (
        <p className="leave-no-requests">No leave requests yet.</p>
      ) : (
        <div className="leave-table-wrapper">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((l) => (
                <tr key={l._id}>
                  <td>{l.reason}</td>
                  <td>
                    {new Date(l.startDate).toLocaleDateString()} {l.startTime}
                  </td>
                  <td>
                    {new Date(l.endDate).toLocaleDateString()} {l.endTime}
                  </td>
                  <td>{l.status}</td>
                  <td>

                    <button
                      className="leave-update-btn"
                      onClick={() => navigate("/")}
                    >
                      update
                    </button>

                    <button
                      className="leave-remove-btn"
                      onClick={() => handleRemoveLeave(l._id)}
                    >
                      Remove
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
