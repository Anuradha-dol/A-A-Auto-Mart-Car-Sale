import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    newPassword: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState("/default-avatar.png");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      axios
        .get(`http://localhost:3000/api/users/${savedUser.id}`)
        .then((res) => {
          setUser(res.data);
          setForm({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            address: res.data.address,
            password: "",
            newPassword: "",
            profilePic: null,
          });
          setPreview(
            res.data.profilePic
              ? `http://localhost:3000/api/users/uploads/${res.data.profilePic}`
              : "/default-avatar.png"
          );
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (form.newPassword) {
      if (!form.password) {
        newErrors.password = "Current password is required to change password";
      } else if (form.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      alert("⚠️ Please correct the errors before updating.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("address", form.address);

      if (form.password && form.newPassword) {
        if (form.password !== user.password) {
          alert("Current password is incorrect");
          return;
        }
        payload.append("password", form.newPassword);
      }

      if (form.profilePic) payload.append("profilePic", form.profilePic);

      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(res.data);
      setEditMode(false);
      setForm((prev) => ({ ...prev, password: "", newPassword: "" }));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found. Please log in again.</p>;

  return (
    <div className="user-profile-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <div className="profile-card">
        <div className="profile-img-container">
          <img src={preview} alt="Profile" className="profile-img" />
          {editMode && <input type="file" accept="image/*" onChange={handleImageChange} />}
        </div>

        {!editMode ? (
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>{user.role}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.address}</p>
            <button className="button edit-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-form">
            <input
              className="edit-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />
            {errors.name && <p className="error">{errors.name}</p>}

            <input
              className="edit-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <input
              className="edit-input"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            {errors.phone && <p className="error">{errors.phone}</p>}

            <input
              className="edit-input"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
            {errors.address && <p className="error">{errors.address}</p>}

            <input
              className="edit-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Current Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}

            <input
              className="edit-input"
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
            {errors.newPassword && <p className="error">{errors.newPassword}</p>}

            <div className="edit-buttons">
              <button className="button save-button" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="button cancel-button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
