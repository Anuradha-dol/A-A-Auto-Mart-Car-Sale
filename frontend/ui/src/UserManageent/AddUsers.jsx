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

  const [errors, setErrors] = useState({});
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

  //  Validation function
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should contain only letters.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("error.");
      return;
    }

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
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {errors.address && <p className="error">{errors.address}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="UserManager">UserManager</option>
            <option value="manager">Manager</option>
            <option value="EmployeeManager">EmployeeManager</option>
            <option value="PaymentManager">PaymentManager</option>
            <option value="VehicleMechanic">VehicleMechanic</option>
            <option value="VehiclePartsManager">VehiclePartsManager</option>
            <option value="CustomerCareOfficer">CustomerCareOfficer</option>
          </select>
          {errors.role && <p className="error">{errors.role}</p>}

          <button type="submit" className="submit-btn">
             Create User
          </button>
        </form>
      </div>
    </div>
  );
}
