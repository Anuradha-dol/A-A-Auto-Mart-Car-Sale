import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddSalaryForm.css";

export default function AddSalaryForm() {
  const [form, setForm] = useState({
    role: "",
    employee: "",
    baseSalary: "",
    bonus: "",
    date: "",
  });
  const [users, setUsers] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();
  const API = "http://localhost:3000/api/salary";

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter employees by selected role
  useEffect(() => {
    if (form.role) {
      setFilteredEmployees(users.filter((u) => u.role.toLowerCase() === form.role.toLowerCase()));
      setForm((prev) => ({ ...prev, employee: "" }));
    }
  }, [form.role, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: negative salaries
    if (Number(form.baseSalary) < 0 || Number(form.bonus) < 0) {
      alert("⚠️ Base Salary and Bonus cannot be negative.");
      return;
    }

    // Validation: past date
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("⚠️ You cannot select a past date.");
      return;
    }

    if (!form.role || !form.employee) {
      alert("⚠️ Please select both Role and Employee.");
      return;
    }

    // Convert date to month string "YYYY-MM"
    const monthStr = selectedDate.toISOString().slice(0, 7);

    try {
      await axios.post(API, {
        employee: form.employee,
        baseSalary: Number(form.baseSalary),
        bonus: Number(form.bonus),
        month: monthStr,
      });
      alert("✅ Salary added successfully!");
      setForm({ role: "", employee: "", baseSalary: "", bonus: "", date: "" });
      navigate("/employeeManagerDashboard-dashboard");
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to add salary: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="form-container">
      {/* Left Image / Back Home */}
      <div className="form-image">
        <button
          className="back-home-btn"
          onClick={() => navigate("/employeeManagerDashboard-dashboard")}
        >
          ← Home
        </button>
        
      </div>

      

      {/* Right Form */}
      <div className="form-wrapper">
        <div className="form-card">
          <h2>Add Salary</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">-- Select Role --</option>
                {[
                  "manager",
                  "EmployeeManager",
                  "PaymentManager",
                  "UserManager",
                  "VehicleMechanic",
                  "VehiclePartsManager",
                  "CustomerCareOfficer",
                ].map((role) => (
                  <option key={role} value={role.toLowerCase()}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Employee</label>
              <select
                name="employee"
                value={form.employee}
                onChange={handleChange}
                required
                disabled={!form.role}
              >
                <option value="">-- Select Employee --</option>
                {filteredEmployees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.adminName} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Base Salary</label>
              <input
                type="number"
                name="baseSalary"
                value={form.baseSalary}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div>
              <label>Bonus</label>
              <input
                type="number"
                name="bonus"
                value={form.bonus}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <button type="submit">Add Salary</button>
          </form>
        </div>
      </div>
    </div>
  );
}
