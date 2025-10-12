import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyVehicleWorks.css";

export default function MyVehicleWorks() {
  const [form, setForm] = useState({
    vehicleDetails: "",
    workDescription: "",
    partsUsed: [],
    expectedCompletionDate: "",
    cost: "",
    status: "Pending",
    user: "",
    userID: "",
  });
  const [myWorks, setMyWorks] = useState([]);

  const API = "http://localhost:3000/api/meca";
  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id;
  const currentUserCode = user?.userID;

  useEffect(() => {
    if (!currentId || !currentUserCode) return;
    setForm((prev) => ({ ...prev, user: currentId, userID: currentUserCode }));
    fetchMyWorks();
  }, [currentId, currentUserCode]);

  const fetchMyWorks = async () => {
    try {
      const res = await axios.get(API);
      const works = res.data.filter(
        (w) =>
          w.userID === currentUserCode ||
          w.user === currentId ||
          w.user?._id === currentId
      );
      setMyWorks(works);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicle works");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId || !currentUserCode) return;

    // ======= VALIDATION =======
    if (!form.vehicleDetails.trim()) {
      alert("❌ Vehicle Details cannot be empty");
      return;
    }

    if (!form.workDescription.trim()) {
      alert("❌ Work Description cannot be empty");
      return;
    }

    if (form.cost && form.cost < 0) {
      alert("❌ Cost cannot be negative");
      return;
    }

    if (form.expectedCompletionDate) {
      const today = new Date();
      const selectedDate = new Date(form.expectedCompletionDate);
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert("❌ Expected Completion Date cannot be in the past");
        return;
      }
    }

    // ======= PAYLOAD =======
    const payload = {
      workID: Date.now().toString(),
      vehicleDetails: form.vehicleDetails,
      workDescription: form.workDescription,
      partsUsed: form.partsUsed || [],
      expectedCompletionDate: form.expectedCompletionDate || null,
      cost: form.cost ? Number(form.cost) : 0,
      status: form.status || "Pending",
      user: currentId,
      userID: currentUserCode,
      reportedDate: new Date(),
    };

    try {
      await axios.post(API, payload);
      alert("✅ Vehicle work submitted successfully!");

      setForm({
        vehicleDetails: "",
        workDescription: "",
        partsUsed: [],
        expectedCompletionDate: "",
        cost: "",
        status: "Pending",
        user: currentId,
        userID: currentUserCode,
      });

      fetchMyWorks();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        `❌ Failed to submit vehicle work: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  return (
    <div className="works-dashboard">
      <div className="work-form-card">
        <h2 className="form-title">Submit Vehicle Work</h2>
        <form className="work-form" onSubmit={handleSubmit}>
          <input type="hidden" name="user" value={form.user} />
          <input type="hidden" name="userID" value={form.userID} />

          <div className="form-group">
            <label>Vehicle Details</label>
            <input
              type="text"
              name="vehicleDetails"
              value={form.vehicleDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Work Description</label>
            <textarea
              name="workDescription"
              value={form.workDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expected Completion Date</label>
            <input
              type="date"
              name="expectedCompletionDate"
              value={form.expectedCompletionDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Estimated Cost</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              min={0}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Submit Work
          </button>
        </form>
      </div>

      <div className="works-table-card">
        <h3>My Vehicle Works</h3>
        {myWorks.length === 0 ? (
          <p className="no-works">No works yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="works-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Description</th>
                  <th>Parts Used</th>
                  <th>Reported</th>
                  <th>Expected Completion</th>
                  <th>Status</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {myWorks.map((w) => (
                  <tr key={w._id}>
                    <td>{w.vehicleDetails}</td>
                    <td>{w.workDescription}</td>
                    <td>
                      {w.partsUsed?.length > 0
                        ? w.partsUsed
                            .map((p) => `${p.partName}(${p.quantity})`)
                            .join(", ")
                        : "-"}
                    </td>
                    <td>{new Date(w.reportedDate).toLocaleDateString()}</td>
                    <td>
                      {w.expectedCompletionDate
                        ? new Date(w.expectedCompletionDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{w.status}</td>
                    <td>{w.cost || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
