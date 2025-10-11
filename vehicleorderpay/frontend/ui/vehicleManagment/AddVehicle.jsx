  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import "./AddVehicle.css";

  export default function VehiclesDashboard() {
    const [formData, setFormData] = useState({
      vehicleID: "",
      name: "",
      type: "",
      brand: "",
      model: "",
      year: "",
      price: "",
      status: "Available",
      image: null,
      user: "",    // MongoDB ObjectId
      userID: "",  // Custom user ID
    });

    const [vehicles, setVehicles] = useState([]);

    const API = "http://localhost:3000/api/cars";

   
    const user = JSON.parse(localStorage.getItem("user"));
    const currentId = user?.id || user?._id; // MongoDB ObjectId of user
    const currentUserCode = user?.userID;    // custom userID string

    // Set user fields in form on load
    useEffect(() => {
      if (!currentId || !currentUserCode) {
        alert("User not logged in!");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        user: currentId,
        userID: currentUserCode,
      }));
      fetchVehicles();
    }, [currentId, currentUserCode]);

    // Fetch vehicles filtered by userID
    const fetchVehicles = async () => {
      try {
        // Use query param ?userID= to filter on backend
        const res = await axios.get(`${API}?userID=${currentUserCode}`);
        setVehicles(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch vehicles.");
      }
    };

    // Handle form input change (text and file)
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    };

    // Handle form submit for creating new vehicle
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!currentId || !currentUserCode) {
        alert("User not logged in!");
        return;
      }

      try {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          data.append(key, formData[key]);
        });

        await axios.post(API, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("✅ Vehicle added successfully!");
        setFormData({
          vehicleID: "",
          name: "",
          type: "",
          brand: "",
          model: "",
          year: "",
          price: "",
          status: "Available",
          image: null,
          user: currentId,
          userID: currentUserCode,
        });
        fetchVehicles();
      } catch (err) {
        alert("❌ Failed to add vehicle.");
        console.error(err.response?.data || err.message);
      }
    };

    return (
      <div className="dashboard-container">
        <h2>Add Vehicle</h2>
        <form onSubmit={handleSubmit}>
          {[
            "vehicleID",
            "name",
            "type",
            "brand",
            "model",
            "year",
            "price",
            "status",
          ].map((field) => (
            <input
              key={field}
              type={
                field === "year" || field === "price" ? "number" : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          ))}
          <input type="file" name="image" onChange={handleChange} />
          <button type="submit">Add Vehicle</button>
        </form>

        <h3>My Vehicles</h3>
        {vehicles.length === 0 ? (
          <p>No vehicles added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Year</th>
                <th>Price</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.vehicleID}</td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.price}</td>
                  <td>{vehicle.status}</td>
                  <td>
                    {vehicle.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${vehicle.image}`}
                        alt={vehicle.name}
                        style={{ width: "50px" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
