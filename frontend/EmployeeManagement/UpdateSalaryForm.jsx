import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateSalaryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employee: "",
    baseSalary: "",
    bonus: "",
    month: "",
  });
  const [employeeName, setEmployeeName] = useState("");
  const [errors, setErrors] = useState({});

  const API = "http://localhost:3000/api/salary";

  // fetch salary by ID
  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setForm({
          employee: res.data.employee._id,
          baseSalary: res.data.baseSalary,
          bonus: res.data.bonus,
          month: res.data.month,
        });
        setEmployeeName(res.data.employee.adminName);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch salary record.");
      }
    };
    fetchSalary();
  }, [id]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative numbers
    if ((name === "baseSalary" || name === "bonus") && Number(value) < 0) return;

    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // validate form
  const validate = () => {
    const newErrors = {};
    if (!form.baseSalary || Number(form.baseSalary) <= 0) {
      newErrors.baseSalary = "Base Salary must be greater than 0.";
    }
    if (form.bonus === "" || Number(form.bonus) < 0) {
      newErrors.bonus = "Bonus cannot be negative.";
    }
    if (!form.month) {
      newErrors.month = "Please select a month.";
    } else {
      const selectedMonth = new Date(form.month + "-01");
      const now = new Date();
      now.setDate(1); // first day of current month
      if (selectedMonth < now) {
        newErrors.month = "Cannot select past month.";
      }
    }
    return newErrors;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.put(`${API}/${id}`, {
        ...form,
        baseSalary: Number(form.baseSalary),
        bonus: Number(form.bonus),
      });
      alert("✅ Salary updated successfully!");
      navigate("/employeeManagerDashboard-dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update salary.");
    }
  };

  return (
    <div className="salary-form-wrapper">
      <h2>Update Salary</h2>
      <form onSubmit={handleSubmit} className="salary-form">
        <div className="salary-field">
          <label>Employee</label>
          <input type="text" value={employeeName} readOnly />
        </div>

        <div className="salary-field">
          <label>Base Salary</label>
          <input
            type="number"
            name="baseSalary"
            value={form.baseSalary}
            onChange={handleChange}
            required
            min="0"
          />
          {errors.baseSalary && <p className="error">{errors.baseSalary}</p>}
        </div>

        <div className="salary-field">
          <label>Bonus</label>
          <input
            type="number"
            name="bonus"
            value={form.bonus}
            onChange={handleChange}
            min="0"
          />
          {errors.bonus && <p className="error">{errors.bonus}</p>}
        </div>

        <div className="salary-field">
          <label>Month</label>
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 7)} // prevents past months
          />
          {errors.month && <p className="error">{errors.month}</p>}
        </div>

        <button type="submit" className="salary-btn">Update Salary</button>
      </form>
    </div>
  );
}
