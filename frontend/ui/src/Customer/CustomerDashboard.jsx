import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VehicleCard from "./VehicleCard"; 
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", minPrice: "", maxPrice: "", type: "" });
  const [sortType, setSortType] = useState("featured"); // featured, priceAsc, priceDesc, newest
  const navigate = useNavigate();

  // Fetch user + vehicles
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return setLoading(false);

    axios.get(`http://localhost:3000/api/users/${savedUser.id}`)
      .then(res => setUser(res.data))
      .catch(console.error);

    axios.get("http://localhost:3000/api/cars")
      .then(res => {
        setVehicles(res.data);
        setFilteredVehicles(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort vehicles
  useEffect(() => {
    let temp = [...vehicles];

    // Search
    if (filters.search) temp = temp.filter(v => v.name.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.type) temp = temp.filter(v => v.type.toLowerCase().includes(filters.type.toLowerCase()));
    if (filters.minPrice) temp = temp.filter(v => v.price >= Number(filters.minPrice));
    if (filters.maxPrice) temp = temp.filter(v => v.price <= Number(filters.maxPrice));

    // Sorting
    if (sortType === "priceAsc") temp.sort((a, b) => a.price - b.price);
    else if (sortType === "priceDesc") temp.sort((a, b) => b.price - a.price);
    else if (sortType === "newest") temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortType === "featured") temp.sort((a, b) => b.discount ? 1 : -1);

    setFilteredVehicles(temp);
  }, [filters, sortType, vehicles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <p className="cd-loading">Loading vehicles...</p>;
  if (!user) return <p className="cd-loading">Please log in to view your dashboard.</p>;

  // Featured Vehicles (offers)
  const featuredVehicles = vehicles.filter(v => v.discount || v.isOffer);

  return (
    <div className="cd-container">
      {/* Header */}
      <header className="cd-header">
        <div>
          <h1>Welcome, {user.name} 👋</h1>
          <p>Discover the best vehicles & offers today!</p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="cd-header-buttons">
          
       
          <button className="cd-btn secondary-btn" onClick={() => navigate("/customersidevehiclepart")}>Vehicle Parts</button>
          <button className="cd-btn secondary-btn" onClick={() => navigate("/cartPage")}>Cart</button>
            <button className="cd-btn primary-btn" onClick={() => navigate("/AllMechanicWorks")}>Stock in  Garage</button>
          <button className="cd-btn primary-btn" onClick={() => navigate("/userProfile")}>Profile</button>
           {/* ➕ Add these two */}
          <button className="cd-btn outline-btn" onClick={() => navigate("/reviews")}>
            📝 Reviews
          </button>
          <button className="cd-btn outline-btn" onClick={() => navigate("/support")}>
            🛟 Support
          </button>
        </div>
      </header>

      {/* Featured / Offers Section */}
      {featuredVehicles.length > 0 && (
        <section className="cd-featured">
          <h2>🔥 Special Offers</h2>
          <div className="cd-grid">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} isOffer={true} />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="cd-filters">
        <input type="text" name="search" placeholder="Search vehicles..." value={filters.search} onChange={handleFilterChange} />
        <input type="text" name="type" placeholder="Type (SUV, Sedan...)" value={filters.type} onChange={handleFilterChange} />
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price ↑</option>
          <option value="priceDesc">Price ↓</option>
        </select>
      </section>

      {/* All Vehicles */}
      <section className="cd-section">
        <h2>All Vehicles</h2>
        {filteredVehicles.length === 0 ? <p>No vehicles found.</p> :
          <div className="cd-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        }
      </section>
    </div>
  );
}
