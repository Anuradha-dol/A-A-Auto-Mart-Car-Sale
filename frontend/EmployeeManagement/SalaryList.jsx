import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalaryList.css";

export default function MySalaryDashboard() {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentId = user?.id;

  useEffect(() => {
    const fetchSalaries = async () => {
      if (!currentId) return;

      try {
        const res = await axios.get("http://localhost:3000/api/salary");
        const mySalaries = res.data.filter((s) => s.employee?._id === currentId);
        setSalaries(mySalaries);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch salary records");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [currentId]);

  if (loading)
    return <p style={{ padding: "20px" }}>Loading your salary records...</p>;
  if (!salaries.length)
    return <p style={{ padding: "20px" }}>No salary records found for you.</p>;

  return (
    <div className="salary-dashboard">
      <h2>💰 My Salary Records</h2>
      <div className="salary-table-container">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Total Salary</th>
              <th>Month</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s._id}>
                <td>{user.name}</td>
                <td>${s.baseSalary}</td>
                <td>${s.bonus}</td>
                <td>${s.totalSalary}</td>
                <td>{s.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
