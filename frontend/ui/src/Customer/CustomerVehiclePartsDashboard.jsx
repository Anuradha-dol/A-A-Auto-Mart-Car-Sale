import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VehiclePartCard from "./VehiclePartCard";


export default function CustomerVehiclePartsDashboard() {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", brand: "", type: "", minPrice: "", maxPrice: "" });
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const API = "http://localhost:3000/api/vehicleparts";

  // Greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  // Fetch user
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // Fetch parts
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await axios.get(API);
        setParts(res.data);
        setFilteredParts(res.data);
      } catch (err) {
        console.error("Error fetching parts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = parts.filter((p) => {
      return (
        p.name.toLowerCase().includes(newFilters.name.toLowerCase()) &&
        p.brand.toLowerCase().includes(newFilters.brand.toLowerCase()) &&
        p.type.toLowerCase().includes(newFilters.type.toLowerCase()) &&
        (newFilters.minPrice === "" || Number(p.price) >= Number(newFilters.minPrice)) &&
        (newFilters.maxPrice === "" || Number(p.price) <= Number(newFilters.maxPrice))
      );
    });

    setFilteredParts(filtered);
  };

  if (loading) return <p className="vd-loading">Loading parts...</p>;
  if (!user) return <p className="vd-loading">Please login to view parts.</p>;

  return (
    <div className="vd-container">
      {/* Header */}
      <header className="vd-header">
        <div>
          <h1>🚗 Vehicle Parts Dashboard</h1>
          <p className="vd-subtitle">{greeting}, {user.name} 👋</p>
        </div>
        <div className="vd-buttons">
          <button className="vd-btn primary-btn" onClick={() => navigate("/customer-dashboard")}>Dashboard</button>
             <button className="vd-btn primary-btn" onClick={() => navigate("/MyVehiclePartRequestsform")}>Request Parts</button>
        </div>
      </header>

      {/* Filters */}
      <section className="vd-filters">
        <input type="text" name="name" placeholder="Part Name" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="brand" placeholder="Brand" value={filters.brand} onChange={handleFilterChange} />
        <input type="text" name="type" placeholder="Type" value={filters.type} onChange={handleFilterChange} />
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
      </section>

      {/* Parts Grid */}
      <section className="vd-parts-grid">
        {filteredParts.length === 0 ? (
          <p>No parts match the filters.</p>
        ) : (
          filteredParts.map(p => <VehiclePartCard key={p._id} part={p} />)
        )}
      </section>
    </div>
  );
}
