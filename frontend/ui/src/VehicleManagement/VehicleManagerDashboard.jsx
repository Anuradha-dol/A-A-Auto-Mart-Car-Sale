import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VehicleCard from "./VehicleCard";
import "./VehiclesManagerDashboard.css"; 

export default function VehiclesManagerDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [stats, setStats] = useState({ thisMonth: 0, lastMonth: 0 });

  const navigate = useNavigate();
  const API = "http://localhost:3000/api/cars";

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

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(API);
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const userId = savedUser?.id || savedUser?._id;
      const userCode = savedUser?.userID;

      const userVehicles = res.data.filter(
        (v) => v.user === userId || v.user?._id === userId || v.userID === userCode
      );

      setVehicles(userVehicles);
      setFilteredVehicles(userVehicles);
      calculateStats(userVehicles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStats = (vehiclesList) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = (thisMonth - 1 + 12) % 12;
    const year = now.getFullYear();

    let thisMonthCount = 0;
    let lastMonthCount = 0;

    vehiclesList.forEach((v) => {
      if (!v.createdAt) return;
      const date = new Date(v.createdAt);
      const vehicleMonth = date.getMonth();
      const vehicleYear = date.getFullYear();

      if (vehicleYear === year && vehicleMonth === thisMonth) thisMonthCount++;
      else if (vehicleYear === year && vehicleMonth === lastMonth) lastMonthCount++;
    });

    setStats({ thisMonth: thisMonthCount, lastMonth: lastMonthCount });
  };

  const applyPriceFilter = () => {
    const filtered = vehicles.filter(
      (v) => Number(v.price) >= priceRange.min && Number(v.price) <= priceRange.max
    );
    setFilteredVehicles(filtered);
  };

  if (loading) return <p className="dashboard-loading">Loading...</p>;
  if (!user) return <p className="dashboard-error">No user found. Please log in.</p>;

  return (

    
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-topbar">
        <h1 className="dashboard-title">🚗 Vehicles Dashboard</h1>
        {user && <p className="dashboard-greeting">Hello, {user.name} 👋</p>}
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => navigate("/addvehicle")}>+ Add Vehicle</button>
          <button className="btn-primary" onClick={() => navigate("/request-leave")}>+ Add Leave</button>
          <button className="btn-secondary" onClick={() => navigate("/SalaryList")}>View Salary</button>
        </div>
      </header>

      {/* USER INFO */}
      <section className="dashboard-userinfo">
 
        <button className="btn-primary" onClick={() => navigate("/userProfile")}>View Profile</button>
      </section>

      {/* STATS */}
      <section className="dashboard-stats">
        <div className="stat-card stat-blue">
          <p>Added This Month</p>
          <h2>{stats.thisMonth}</h2>
        </div>
        <div className="stat-card stat-green">
          <p>Added Last Month</p>
          <h2>{stats.lastMonth}</h2>
        </div>
        <div className="stat-card stat-purple">
          <p>Total Vehicles</p>
          <h2>{vehicles.length}</h2>
        </div>
        <div className="stat-card stat-red">
          <p>Filtered Vehicles</p>
          <h2>{filteredVehicles.length}</h2>
        </div>
      </section>

      {/* FILTER */}
      <section className="dashboard-filter">
        <h2>🔍 Filter by Price</h2>
        <div className="filter-inputs">
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
          <button className="btn-primary" onClick={applyPriceFilter}>Apply</button>
        </div>
      </section>

      {/* VEHICLES */}
      <section className="dashboard-vehicles">
        {filteredVehicles.length === 0 ? (
          <p className="vehicles-empty">No vehicles match your filter.</p>
        ) : (
          filteredVehicles.map((v) => (
            <VehicleCard key={v._id} vehicle={v} handleDelete={handleDelete} />
          ))
        )}
      </section>
    </div>
  );
}
