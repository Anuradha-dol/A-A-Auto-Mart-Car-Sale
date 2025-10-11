import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateVehicle.css";

export default function UpdateVehicle({ fetchVehicles }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicleID: "",
    name: "",
    type: "",
    brand: "",
    model: "",
    year: "",
    status: "Available",
    image: null,
  });

  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const API = "http://localhost:3000/api/cars";

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        const { vehicleID, name, type, brand, model, year, status, image } = res.data;
        setForm({ vehicleID, name, type, brand, model, year, status, image: null });
        setExistingImage(image);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch vehicle data.");
      }
    };
    fetchVehicle();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!form.vehicleID.trim()) newErrors.vehicleID = "Vehicle ID is required.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.type.trim()) newErrors.type = "Type is required.";
    if (!form.brand.trim()) newErrors.brand = "Brand is required.";
    if (!form.model.trim()) newErrors.model = "Model is required.";

    const currentYear = new Date().getFullYear();
    if (!form.year || isNaN(form.year) || form.year < 1900 || form.year > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}.`;
    }

    if (form.image) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(form.image.type)) {
        newErrors.image = "Only JPG, JPEG, PNG, or WEBP images are allowed.";
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (form.image.size > maxSize) {
        newErrors.image = "Image must be less than 2MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "image") formData.append(key, value);
    });
    if (form.image) formData.append("image", form.image);

    try {
      await axios.put(`${API}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Vehicle updated successfully!");
      if (fetchVehicles) fetchVehicles();
      navigate("/vehicleManager-dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update vehicle.");
    }
  };

  return (
    <div className="update-vehicle-container">
      <h2>Update Vehicle</h2>
      <form onSubmit={handleSubmit} className="update-vehicle-form">
        {["vehicleID", "name", "type", "brand", "model", "year", "status"].map((field) => (
          <div key={field} className="form-group">
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {field === "status" ? (
              <select id={field} name={field} value={form[field]} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            ) : (
              <input
                id={field}
                type={field === "year" ? "number" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            )}
            {errors[field] && <p className="error">{errors[field]}</p>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="image">Vehicle Image</label>
          <input id="image" type="file" name="image" accept="image/*" onChange={handleChange} />
          {errors.image && <p className="error">{errors.image}</p>}
          {existingImage && !form.image && (
            <p className="current-image">
              Current:{" "}
              <a href={`http://localhost:3000/uploads/${existingImage}`} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </p>
          )}
        </div>

        <button type="submit" className="update-btn">Update Vehicle</button>
      </form>
    </div>
  );
}
