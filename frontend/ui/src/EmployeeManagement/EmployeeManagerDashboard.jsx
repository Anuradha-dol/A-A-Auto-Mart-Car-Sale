import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SalaryManagerDashboard.css";

export default function SalaryManagerDashboard() {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const fetchSalaries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/salary");
      setSalaries(res.data);
    } catch (err) {
      console.error("Error fetching salaries:", err);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filteredSalaries = salaries.filter(
    (s) =>
      s.employee?.adminName?.toLowerCase().includes(search.toLowerCase()) ||
      s.employee?.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.month?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        await axios.delete(`http://localhost:3000/api/salary/${id}`);
        alert("Salary deleted successfully!");
        fetchSalaries();
      } catch (err) {
        console.error(err);
        alert("Error deleting salary");
      }
    }
  };

  // Current + Previous Month Stats
  const now = new Date();
  const currentMonthName = now.toLocaleString("default", { month: "long" });
  const currentMonthNum = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const prevDate = new Date(currentYear, currentMonthNum - 2, 1);
  const prevMonthName = prevDate.toLocaleString("default", { month: "long" });
  const prevMonthNum = prevDate.getMonth() + 1;
  const prevYear = prevDate.getFullYear();

  const isSalaryForMonth = (salary, year, monthNum, monthName) => {
    if (!salary.month) return false;
    const monthValue = salary.month.toLowerCase();
    if (monthValue === monthName.toLowerCase()) return true;
    if (salary.month.includes("-")) {
      const [yr, mn] = salary.month.split("-");
      return parseInt(yr, 10) === year && parseInt(mn, 10) === monthNum;
    }
    return false;
  };

  const monthlySalaries = salaries.filter((s) =>
    isSalaryForMonth(s, currentYear, currentMonthNum, currentMonthName)
  );
  const prevMonthlySalaries = salaries.filter((s) =>
    isSalaryForMonth(s, prevYear, prevMonthNum, prevMonthName)
  );

  const monthlyCount = monthlySalaries.length;
  const monthlyTotal = monthlySalaries.reduce(
    (acc, s) => acc + (s.totalSalary || 0),
    0
  );

  const prevMonthlyCount = prevMonthlySalaries.length;
  const prevMonthlyTotal = prevMonthlySalaries.reduce(
    (acc, s) => acc + (s.totalSalary || 0),
    0
  );

  // PDF generation including stats + table
  const downloadPDF = () => {
    const element = document.getElementById("salary-report-pdf");
    element.style.display = "block";

    html2canvas(element, { scale: 2, useCORS: true, allowTaint: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("salary_report.pdf");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        alert("Failed to generate PDF.");
      })
      .finally(() => {
        element.style.display = "none";
      });
  };

  return (
    <div className="um-dashboard">
      {/* Header */}
      <header className="um-header">
        <div className="header-content">
          <div>
            <h1>{greeting}, {user.name} 👋</h1>
            <p className="subtitle">Manage employee salaries</p>
          </div>
          <button
            className="view-profile-btn"
            onClick={() => navigate("/userProfile")}
          >
            View Profile
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="um-stats">
        <div className="stat-card">
          <h2>{salaries.length}</h2>
          <p>Total Salary Records</p>
        </div>
        <div className="stat-card">
          <h2>{salaries.reduce((acc, s) => acc + (s.totalSalary || 0), 0).toFixed(2)}</h2>
          <p>Total Payout</p>
        </div>
        <div className="stat-card">
          <h2>{monthlyCount}</h2>
          <p>{currentMonthName} Salary Records</p>
        </div>
        <div className="stat-card">
          <h2>{monthlyTotal.toFixed(2)}</h2>
          <p>{currentMonthName} Total Payout</p>
        </div>
        <div className="stat-card prev">
          <h2>{prevMonthlyCount}</h2>
          <p>{prevMonthName} Salary Records</p>
        </div>
        <div className="stat-card prev">
          <h2>{prevMonthlyTotal.toFixed(2)}</h2>
          <p>{prevMonthName} Total Payout</p>
        </div>
      </section>

      {/* Search & Actions */}
      <div className="um-actions">
        <input
          type="text"
          placeholder="🔍 Search by employee or month..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="refresh-btn" onClick={fetchSalaries}>⟳ Refresh</button>
        <button className="add-user-btn" onClick={() => navigate("/addSalaryForm")}>➕ Add Salary</button>
        <button className="add-user-btn" onClick={() => navigate("/allLeavesDashboard")}>View Leave Req</button>
        <button className="add-user-btn" onClick={() => navigate("/SalaryList")}>+ View SalaryL</button>
        <button className="add-user-btn" onClick={downloadPDF}>📄 Download PDF</button>
      </div>

      {/* Salary Table for display */}
      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Role</th>
              <th>Base Salary</th>
              <th>Bonus</th>
              <th>Month</th>
              <th>Total Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length > 0 ? (
              filteredSalaries.map((s) => (
                <tr key={s._id}>
                  <td>{s.employee?.adminName}</td>
                  <td>{s.employee?.email}</td>
                  <td>
                    <span className={`role-badge ${s.employee?.role?.toLowerCase()}`}>
                      {s.employee?.role}
                    </span>
                  </td>
                  <td>${s.baseSalary}</td>
                  <td>${s.bonus}</td>
                  <td>{s.month}</td>
                  <td><strong>${s.totalSalary}</strong></td>
                  <td className="actions">
                    <button className="btn edit" onClick={() => navigate(`/updateSalaryForm/${s._id}`)}>✏️</button>
                    <button className="btn delete" onClick={() => handleDelete(s._id)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-users">No salary records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden table + stats for PDF */}
      <div id="salary-report-pdf" style={{ display: "none", padding: "20px" }}>
        <h2>Salary Report</h2>
        <p>Generated by: {user.name}</p>
        <p>Date: {new Date().toLocaleDateString()}</p>

        <div style={{ margin: "10px 0" }}>
          <p><strong>Total Salary Records:</strong> {salaries.length}</p>
          <p><strong>Total Payout:</strong> {salaries.reduce((acc, s) => acc + (s.totalSalary || 0), 0).toFixed(2)}</p>
          <p><strong>{currentMonthName} Payout:</strong> {monthlyTotal.toFixed(2)}</p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Employee</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Email</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Role</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Base Salary</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Bonus</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Month</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Total Salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((s) => (
              <tr key={s._id}>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.employee?.adminName}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.employee?.email}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.employee?.role}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.baseSalary}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.bonus}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.month}</td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>{s.totalSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
