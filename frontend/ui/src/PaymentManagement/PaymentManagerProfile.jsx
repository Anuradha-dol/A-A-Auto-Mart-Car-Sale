import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentManagerProfile() {
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
  });

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
          });
        })
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Update profile info
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      // If password change requested
      if (form.password && form.newPassword) {
        if (form.password !== user.password) {
          alert("Current password is incorrect");
          return;
        }
        payload.password = form.newPassword;
      }

      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}`,
        payload
      );

      alert("Profile updated successfully!");
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found. Please log in again.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
        {!editMode ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 mb-2 border rounded"
            />

            {/* Password change */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-2 mb-2 border rounded"
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
