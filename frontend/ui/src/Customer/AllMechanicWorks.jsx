import React, { useEffect, useState } from "react";
import axios from "axios";
import"./AllMechanicWorks.css";

export default function AllMechanicWorks() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/meca");
        setWorks(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch mechanic works");
      }
    };
    fetchWorks();
  }, []);

  return (
    
  <div className="works-card">
  <h2>All Mechanic Works</h2>
  {works.length === 0 ? (
    <p className="no-works">No works found.</p>
  ) : (
        <table>
          <thead>
            <tr>
              <th>Vehicle Details</th>
              <th>Work Description</th>
              <th>Parts Used</th>
              <th>Status</th>
              <th>Reported Date</th>
              <th>Expected Completion</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w._id}>
                <td>{w.vehicleDetails}</td>
                <td>{w.workDescription}</td>
                <td>
                  {w.partsUsed?.length > 0
                    ? w.partsUsed.map((p) => `${p.partName} (${p.quantity})`).join(", ")
                    : "-"}
                </td>
                <td>{w.status}</td>
                <td>{new Date(w.reportedDate).toLocaleDateString()}</td>
                <td>{w.expectedCompletionDate ? new Date(w.expectedCompletionDate).toLocaleDateString() : "-"}</td>
                <td>{w.cost || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
