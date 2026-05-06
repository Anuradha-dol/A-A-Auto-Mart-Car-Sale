import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateVehicleRequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    partName: "",
    partNumber: "",
    quantity: 1,
    neededByDate: "",
    status: "Pending",
  });

  const API = "http://localhost:3000/api/tik";

  // Fetch vehicle part request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setForm({
          partName: res.data.partName,
          partNumber: res.data.partNumber || "",
          quantity: res.data.quantity,
          neededByDate: res.data.neededByDate.slice(0, 10),
          status: res.data.status,
        });
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch vehicle part request");
      }
    };
    fetchRequest();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/${id}`, form);
      alert("✅ Vehicle part request updated successfully!");
      navigate("/vehiclePartManagerDashboard"); // redirect to manager dashboard
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update vehicle part request.");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Vehicle Part Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Part Name</label>
          <input
            type="text"
            name="partName"
            value={form.partName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Part Number</label>
          <input
            type="text"
            name="partNumber"
            value={form.partNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            min={1}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Needed By Date</label>
          <input
            type="date"
            name="neededByDate"
            value={form.neededByDate}
            onChange={handleChange}
            required
          />
        </div>

      
        <button type="submit">Update Request</button>
      </form>
    </div>
  );
}
