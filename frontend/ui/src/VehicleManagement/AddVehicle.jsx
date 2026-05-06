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
    user: "",
    userID: "",
  });

  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);

  const API = "http://localhost:3000/api/cars";

  const user = JSON.parse(localStorage.getItem("user"));
  const currentId = user?.id || user?._id;
  const currentUserCode = user?.userID;

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

  // ✅ Fetch Vehicles
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API}?userID=${currentUserCode}`);
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vehicles.");
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Validation Logic
  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.vehicleID.trim()) newErrors.vehicleID = "Vehicle ID is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";

    // Year validation
    if (!formData.year) newErrors.year = "Year is required";
    else if (formData.year < 1886 || formData.year > currentYear + 1)
      newErrors.year = `Enter a valid year between 1886 and ${currentYear + 1}`;

    // Price validation
    if (!formData.price) newErrors.price = "Price is required";
    else if (formData.price <= 0)
      newErrors.price = "Price must be a positive number";

    // Status validation
    if (!formData.status.trim()) newErrors.status = "Status is required";

    // Image validation
    if (!formData.image) newErrors.image = "Vehicle image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fix validation errors before submitting.");
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
      setErrors({});
      fetchVehicles();
    } catch (err) {
      alert("❌ Failed to add vehicle.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
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
          <div key={field} className="form-group">
            <input
              type={
                field === "year" || field === "price" ? "number" : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
            {errors[field] && (
              <span className="error-message">{errors[field]}</span>
            )}
          </div>
        ))}

        <div className="form-group">
          <input type="file" name="image" onChange={handleChange} />
          {errors.image && (
            <span className="error-message">{errors.image}</span>
          )}
        </div>

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
                      style={{ width: "50px", height: "40px", objectFit: "cover" }}
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
