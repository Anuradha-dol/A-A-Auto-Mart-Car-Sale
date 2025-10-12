import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateVehiclePart.css";

export default function UpdateVehiclePart({ fetchParts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    partID: "",
    name: "",
    type: "",
    brand: "",
    model: "",
    quantity: "",
    price: "",
    status: "Available",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3000/api/vehicleparts";

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await axios.get(`${API}/${id}`);
        setForm({ ...res.data, image: null });
        if (res.data.image) {
          setPreview(`http://localhost:3000/uploads/${res.data.image}`);
        }
      } catch (err) {
        alert("❌ Failed to fetch part.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPart();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (form.quantity <= 0 || isNaN(form.quantity)) {
      alert("❌ Quantity must be a valid positive number.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "image" && form.image) formData.append("image", form.image);
      else formData.append(key, form[key]);
    });

    try {
      const res = await axios.put(`${API}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        alert("✅ Vehicle part updated successfully!");
        fetchParts();
        navigate("/vehicleparts-dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading part details...</p>
      </div>
    );
  }

  return (
    <div className="update-container">
      {/* ✅ Home button at top-left */}
      <button
        className="home-btn"
        onClick={() => navigate("/vehicleParts-dashboard")}
      >
        ⬅ Home
      </button>

      <form className="update-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Update Vehicle Part</h2>

        <div className="form-grid">
          {["partID", "name", "type", "brand", "model", "quantity", "price", "status"].map(
            (field) => (
              <div className="form-group" key={field}>
                <label>{field}</label>
                <input
                  type={field === "quantity" || field === "price" ? "number" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            )
          )}
        </div>

        <div className="form-group full-width">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {preview && <img src={preview} alt="preview" className="preview" />}
        </div>

        <button type="submit" className="submit-btn">
          Update Part
        </button>
      </form>
    </div>
  );
}
