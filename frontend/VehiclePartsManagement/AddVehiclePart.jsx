import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VehiclePartsform.css";

export default function VehiclePartsDashboard() {
  const [formData, setFormData] = useState({
    partID: "",
    name: "",
    type: "",
    brand: "",
    model: "",
    quantity: "",
    price: "",
    status: "Available",
    image: null,
    user: "",
    userID: "",
  });

  const [parts, setParts] = useState([]);
  const API = "http://localhost:3000/api/vehicleparts";

  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id || user?._id;
  const currentUserCode = user?.userID;

  useEffect(() => {
    if (!currentId || !currentUserCode) {
      alert("User not logged in!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      user: currentId,
      userID: currentUserCode,
    }));
    fetchParts();
  }, [currentId, currentUserCode]);

  const fetchParts = async () => {
    try {
      const res = await axios.get(API);
      const userParts = res.data.filter(
        (p) => p.userID === currentUserCode || p.user === currentId || p.user?._id === currentId
      );
      setParts(userParts);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicle parts.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentId || !currentUserCode) {
      alert("User not logged in!");
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      await axios.post(API, data, { headers: { "Content-Type": "multipart/form-data" } });
      alert("✅ Vehicle part added successfully!");
      setFormData({
        partID: "",
        name: "",
        type: "",
        brand: "",
        model: "",
        quantity: "",
        price: "",
        status: "Available",
        image: null,
        user: currentId,
        userID: currentUserCode,
      });
      fetchParts();
    } catch (err) {
      alert("❌ Failed to add vehicle part.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="vpd-container">
      <h2 className="vpd-title">Add Vehicle Part</h2>
      <form className="vpd-form" onSubmit={handleSubmit}>
        {["partID","name","type","brand","model","quantity","price","status"].map((field) => (
          <input
            key={field}
            type={field === "quantity" || field === "price" ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            required
            className="vpd-input"
          />
        ))}
        <input type="file" name="image" onChange={handleChange} className="vpd-input-file" />
        <button type="submit" className="vpd-button">Add Part</button>
      </form>

      <h3 className="vpd-subtitle">My Vehicle Parts</h3>
      {parts.length === 0 ? (
        <p className="vpd-no-parts">No parts added yet.</p>
      ) : (
        <table className="vpd-table">
          <thead>
            <tr>
              {["Part ID","Name","Type","Brand","Model","Quantity","Price","Status","Image"].map((th) => (
                <th key={th}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part._id}>
                <td>{part.partID}</td>
                <td>{part.name}</td>
                <td>{part.type}</td>
                <td>{part.brand}</td>
                <td>{part.model}</td>
                <td>{part.quantity}</td>
                <td>{part.price}</td>
                <td>{part.status}</td>
                <td>
                  {part.image ? (
                    <img
                      src={`http://localhost:3000/uploads/${part.image}`}
                      alt={part.name}
                      className="vpd-img"
                    />
                  ) : ("No Image")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
