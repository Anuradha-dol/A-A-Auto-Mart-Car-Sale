import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehiclePartRequest.css"; 

export default function MyVehiclePartRequests() {
  const [form, setForm] = useState({
    partName: "",
    partNumber: "",
    quantity: 1,
    neededByDate: "",
    user: "",
    userID: "",
  });

  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id;
  const currentUserCode = user?.userID;

  useEffect(() => {
    if (!currentId || !currentUserCode) return;
    setForm((prev) => ({ ...prev, user: currentId, userID: currentUserCode }));
    fetchRequests();
  }, [currentId, currentUserCode]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/tik");
      const filtered = res.data.filter(
        (r) =>
          r.userID === currentUserCode ||
          r.user === currentId ||
          r.user?._id === currentId
      );
      setRequests(filtered);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch vehicle part requests");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure quantity is numeric and not negative
    if (name === "quantity") {
      if (value === "" || Number(value) < 1) {
        setForm((prev) => ({ ...prev, [name]: 1 }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.partName.trim()) {
      alert("❌ Part Name cannot be empty");
      return false;
    }

    if (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 1) {
      alert("❌ Quantity must be a valid number ≥ 1");
      return false;
    }

    if (!form.neededByDate) {
      alert("❌ Needed By Date is required");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const neededDate = new Date(form.neededByDate);
    if (neededDate < today) {
      alert("❌ Needed By Date cannot be in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId || !currentUserCode) return;

    if (!validate()) return;

    try {
      await axios.post("http://localhost:3000/api/tik", { 
        ...form, 
        user: currentId, 
        userID: currentUserCode,
        requestDate: new Date() 
      });
      alert("✅ Vehicle part request submitted successfully!");
      setForm({ partName: "", partNumber: "", quantity: 1, neededByDate: "", user: currentId, userID: currentUserCode });
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit request");
    }
  };

  return (
    <div className="vp-dashboard">
      <section className="vp-form-section">
        <h2 className="vp-title">Submit Vehicle Part Request</h2>
        <form className="vp-form" onSubmit={handleSubmit}>
          <input type="hidden" name="user" value={form.user} />
          <input type="hidden" name="userID" value={form.userID} />

          <div className="vp-field">
            <label>Part Name</label>
            <input type="text" name="partName" value={form.partName} onChange={handleChange} required />
          </div>

          <div className="vp-field">
            <label>Part Number</label>
            <input type="text" name="partNumber" value={form.partNumber} onChange={handleChange} />
          </div>

          <div className="vp-field">
            <label>Quantity</label>
            <input type="number" name="quantity" value={form.quantity} min={1} onChange={handleChange} required />
          </div>

          <div className="vp-field">
            <label>Needed By Date</label>
            <input
              type="date"
              name="neededByDate"
              value={form.neededByDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <button type="submit" className="vp-submit-btn">Submit Request</button>
        </form>
      </section>

      <section className="vp-requests-section">
        <h3 className="vp-subtitle">My Vehicle Part Requests</h3>
        {requests.length === 0 ? (
          <p className="vp-empty-msg">No requests yet.</p>
        ) : (
          <div className="vp-requests-grid">
            {requests.map((r) => (
              <div key={r._id} className="vp-request-card">
                <h4>{r.partName}</h4>
                <p><strong>Part Number:</strong> {r.partNumber || "-"}</p>
                <p><strong>Quantity:</strong> {r.quantity}</p>
                <p><strong>Request Date:</strong> {new Date(r.requestDate).toLocaleDateString()}</p>
                <p><strong>Needed By:</strong> {new Date(r.neededByDate).toLocaleDateString()}</p>
                <span className={`vp-status ${r.status.toLowerCase()}`}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
