import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VehiclePartCard from "./VehiclePartCard";
import "./VehicleDashboard.css";

export default function VehiclePartsManagerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({ thisMonth: 0, lastMonth: 0, total: 0, lowStock: 0 });
  const [filters, setFilters] = useState({ name: "", brand: "", type: "", minPrice: "", maxPrice: "" });
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
    if (savedUser) {
      axios
        .get(`http://localhost:3000/api/users/${savedUser.id}`)
        .then((res) => setUser(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  // Fetch parts and stats
  const fetchParts = async () => {
    try {
      const res = await axios.get(API);
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const userId = savedUser?.id || savedUser?._id;
      const userCode = savedUser?.userID;

      const userParts = res.data.filter(
        (part) =>
          part.user === userId || part.user?._id === userId || part.userID === userCode
      );

      setParts(userParts);
      setFilteredParts(userParts);

      // Stats
      const now = new Date();
      const thisMonth = userParts.filter(p => new Date(p.createdAt).getMonth() === now.getMonth() && new Date(p.createdAt).getFullYear() === now.getFullYear()).length;
      const lastMonth = userParts.filter(p => {
        const d = new Date(p.createdAt);
        const lastMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonthIndex && d.getFullYear() === year;
      }).length;
      const total = userParts.length;
      const lowStock = userParts.filter(p => Number(p.quantity) < 4).length;

      setStats({ thisMonth, lastMonth, total, lowStock });
    } catch (err) {
      console.error("Error fetching parts:", err);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // Delete part
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this part?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchParts();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle filter change
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

  if (loading) return <p className="vd-loading">Loading dashboard...</p>;
  if (!user) return <p className="vd-loading">No user data found. Please log in again.</p>;

  return (
    <div className="vd-container">
      <header className="vd-header">
        <div>
          <h1>🛒 Vehicle Parts Manager Dashboard</h1>
          <p className="vd-subtitle">{greeting}, {user.name} 👋</p>
        </div>
        <div className="vd-buttons">
          <button onClick={() => navigate("/userProfile")} className="vd-btn primary-btn">Profile</button>
          <button onClick={() => navigate("/addvehiclepart")} className="vd-btn secondary-btn">+ Add Part</button>
          <button onClick={() => navigate("/request-leave")} className="vd-btn secondary-btn">+ Add Leave</button>
          <button onClick={() => navigate("/AllVehiclePartRequestsDashboard")} className="vd-btn secondary-btn">+ Requests</button>
          <button onClick={() => navigate("/SalaryList")} className="vd-btn secondary-btn">+ Salary</button>
        </div>
      </header>

      {/* Stats */}
      <section className="vd-stats-cards">
        <div className="vd-stat-card"><h3>This Month</h3><p>{stats.thisMonth}</p></div>
        <div className="vd-stat-card"><h3>Last Month</h3><p>{stats.lastMonth}</p></div>
        <div className="vd-stat-card"><h3>Total</h3><p>{stats.total}</p></div>
        {stats.lowStock > 0 && (
          <div className="vd-stat-card low-stock"><h3>Low Stock (&lt;4)</h3><p>{stats.lowStock}</p></div>
        )}
      </section>

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
        {filteredParts.length === 0 ? <p>No parts match the filters.</p> :
          filteredParts.map(p => <VehiclePartCard key={p._id} part={p} handleDelete={handleDelete} />)
        }
      </section>
    </div>
  );
}
