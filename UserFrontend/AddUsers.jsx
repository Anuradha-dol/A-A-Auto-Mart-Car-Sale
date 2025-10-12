import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

export default function AddUser() {
  const [formData, setFormData] = useState({
    userID: "", // auto-generated
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "UserManager", // default role
  });

  const navigate = useNavigate();

  // Generate a random userID when component loads
  useEffect(() => {
    const randomID = generateRandomUserID();
    setFormData((prev) => ({ ...prev, userID: randomID }));
  }, []);

  const generateRandomUserID = () => {
    const prefix = "USR-";
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${prefix}${randomNum}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/users", formData);
      alert(`✅ User ${res.data.name} created successfully!`);

     
      navigate("/usermanager");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error creating user");
    }
  };

  return (
    <div className="adduser-container">
      <div className="adduser-card">
        <h2 className="title">➕ Create New User</h2>
        <p className="subtitle">Fill in the details below to add a new User</p>

        <form onSubmit={handleSubmit} className="adduser-form">
          <input type="hidden" name="userID" value={formData.userID} />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="UserManager">UserManager</option>
            <option value="manager">Manager</option>
            <option value="EmployeeManager">EmployeeManager</option>
            <option value="PaymentManager">PaymentManager</option>
            <option value="VehicleMechanic">VehicleMechanic</option>
            <option value="VehiclePartsManager">VehiclePartsManager</option>
            <option value="CustomerCareOfficer">CustomerCareOfficer</option>
          </select>

          <button type="submit" className="submit-btn">
            🚀 Create User
          </button>
        </form>
      </div>
    </div>
  );
}
