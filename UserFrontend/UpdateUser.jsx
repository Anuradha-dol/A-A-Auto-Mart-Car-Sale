import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AddUser.css"; 

export default function UpdateUser() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userID: "",
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "UserManager",
  });

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/users/${id}`);
        setFormData({
          userID: res.data.userID,
          name: res.data.name,
          email: res.data.email,
          password: "", 
          address: res.data.address,
          phone: res.data.phone,
          role: res.data.role,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        alert("Error fetching user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, formData);
      alert(`✅ User ${formData.name} updated successfully!`);
      navigate("/usermanager"); 
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error updating user");
    }
  };

  return (
    <div className="adduser-container">
      <div className="adduser-card">
        <h2 className="title">✏️ Update User</h2>
        <p className="subtitle">Edit the details and save changes</p>

        <form onSubmit={handleSubmit} className="adduser-form">
          <input
            type="text"
            name="userID"
            placeholder="User ID"
            value={formData.userID}
            onChange={handleChange}
            required
          />
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
            placeholder="New Password (leave blank if no change)"
            value={formData.password}
            onChange={handleChange}
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
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
            <option value="EmployeeManager">EmployeeManager</option>
            <option value="PaymentManager">PaymentManager</option>
            <option value="VehicleMechanic">VehicleMechanic</option>
            <option value="VehiclePartsManager">VehiclePartsManager</option>
            <option value="CustomerCareOfficer">CustomerCareOfficer</option>
          </select>

     <button type="submit" className="submit-btn">
  💾 Save Changes
   </button>
     <button
  type="button"
  className="submit-btn cancel-btn"
  onClick={() => navigate("/usermanager")}
>
      ❌ Cancel
      </button>

        </form>
      </div>
    </div>
  );
}
