import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./MyVehicleWorks.css";

export default function MyVehicleWorks() {
  const { id } = useParams(); 
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState({});
  const [myWorks, setMyWorks] = useState([]);
  const API = "http://localhost:3000/api/meca";

  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id;
  const currentUserCode = user?.userID;

  useEffect(() => {
    if (!currentId || !currentUserCode) return;

    setForm((prev) => ({ ...prev, user: currentId, userID: currentUserCode }));

    fetchMyWorks();

    if (id) fetchWorkById(id);
  }, [currentId, currentUserCode, id]);

  const fetchMyWorks = async () => {
    try {
      const res = await axios.get(API);
      const works = res.data.filter(
        (w) => w.userID === currentUserCode || w.user === currentId || w.user?._id === currentId
      );
      setMyWorks(works);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicle works");
    }
  };

  const fetchWorkById = async (workId) => {
    try {
      const res = await axios.get(`${API}/${workId}`);
      setForm({
        vehicleDetails: res.data.vehicleDetails,
        workDescription: res.data.workDescription,
        partsUsed: res.data.partsUsed || [],
        expectedCompletionDate: res.data.expectedCompletionDate
          ? new Date(res.data.expectedCompletionDate).toISOString().substr(0, 10)
          : "",
        cost: res.data.cost || "",
        status: res.data.status || "Pending",
        user: res.data.user,
        userID: res.data.userID,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch work for editing");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!form.vehicleDetails.trim()) newErrors.vehicleDetails = "Vehicle details are required";
    if (!form.workDescription.trim()) newErrors.workDescription = "Work description is required";
    if (form.cost && Number(form.cost) < 0) newErrors.cost = "Cost cannot be negative";
    if (form.expectedCompletionDate && new Date(form.expectedCompletionDate) < new Date()) {
      newErrors.expectedCompletionDate = "Expected completion cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId || !currentUserCode) return;

    if (!validate()) return; // stop submission if validation fails

    const payload = {
      vehicleDetails: form.vehicleDetails,
      workDescription: form.workDescription,
      partsUsed: form.partsUsed || [],
      expectedCompletionDate: form.expectedCompletionDate || null,
      cost: form.cost ? Number(form.cost) : 0,
      status: form.status || "Pending",
      user: currentId,
      userID: currentUserCode,
    };

    try {
      if (id) {
        await axios.put(`${API}/${id}`, payload);
        alert("✅ Vehicle work updated successfully!");
      } else {
        payload.workID = Date.now().toString();
        payload.reportedDate = new Date();
        await axios.post(API, payload);
        alert("✅ Vehicle work submitted successfully!");
      }

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
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(`❌ Failed to submit/update vehicle work: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="works-dashboard">
      <div className="work-form-card">
        <h2 className="form-title">{id ? "Update Vehicle Work" : "Submit Vehicle Work"}</h2>
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
            {errors.vehicleDetails && <span className="error">{errors.vehicleDetails}</span>}
          </div>

          <div className="form-group">
            <label>Work Description</label>
            <textarea
              name="workDescription"
              value={form.workDescription}
              onChange={handleChange}
              required
            />
            {errors.workDescription && <span className="error">{errors.workDescription}</span>}
          </div>

          <div className="form-group">
            <label>Expected Completion Date</label>
            <input
              type="date"
              name="expectedCompletionDate"
              value={form.expectedCompletionDate}
              onChange={handleChange}
            />
            {errors.expectedCompletionDate && <span className="error">{errors.expectedCompletionDate}</span>}
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
            {errors.cost && <span className="error">{errors.cost}</span>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">{id ? "Update Work" : "Submit Work"}</button>
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
                    <td>{w.partsUsed?.length > 0 ? w.partsUsed.map(p => `${p.partName}(${p.quantity})`).join(", ") : "-"}</td>
                    <td>{new Date(w.reportedDate).toLocaleDateString()}</td>
                    <td>{w.expectedCompletionDate ? new Date(w.expectedCompletionDate).toLocaleDateString() : "-"}</td>
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
