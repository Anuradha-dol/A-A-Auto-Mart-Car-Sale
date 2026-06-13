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
    price: "",
    status: "Available",
    image: null,
  });

  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const API = "http://localhost:3000/api/cars";

  // ✅ Fetch existing vehicle
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        const { vehicleID, name, type, brand, model, year, price, status, image } = res.data;

        setForm({
          vehicleID: vehicleID || "",
          name: name || "",
          type: type || "",
          brand: brand || "",
          model: model || "",
          year: year || "",
          price: price || "",
          status: status || "Available",
          image: null,
        });

        setExistingImage(image);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch vehicle data.");
      }
    };
    fetchVehicle();
  }, [id]);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!form.vehicleID.trim()) newErrors.vehicleID = "Vehicle ID is required.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.type.trim()) newErrors.type = "Type is required.";
    if (!form.brand.trim()) newErrors.brand = "Brand is required.";
    if (!form.model.trim()) newErrors.model = "Model is required.";

    // ✅ Year validation
    if (!form.year) {
      newErrors.year = "Year is required.";
    } else if (!/^\d{4}$/.test(form.year)) {
      newErrors.year = "Year must be 4 digits.";
    } else if (Number(form.year) < 1886 || Number(form.year) > currentYear) {
      newErrors.year = `Enter a valid year (1886–${currentYear}).`;
    }

    // ✅ Price validation (prevent negative or zero)
    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(form.price)) {
      newErrors.price = "Price must be a valid number.";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than zero.";
    }

    // ✅ Image validation (only if uploading a new one)
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

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Submit handler
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
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>

            {field === "status" ? (
              <select
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            ) : (
              <input
                id={field}
                type={field === "year" || field === "price" ? "number" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                min={field === "price" || field === "year" ? "1" : undefined}
              />
            )}
            {errors[field] && <p className="error">{errors[field]}</p>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="image">Vehicle Image</label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.image && <p className="error">{errors.image}</p>}
          {existingImage && !form.image && (
            <p className="current-image">
              Current:{" "}
              <a
                href={`http://localhost:3000/uploads/${existingImage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </p>
          )}
        </div>

        <button type="submit" className="update-btn">
          Update Vehicle
        </button>
      </form>
    </div>
  );
}
