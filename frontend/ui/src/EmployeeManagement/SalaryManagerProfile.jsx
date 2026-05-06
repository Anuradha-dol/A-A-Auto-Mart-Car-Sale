import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SalaryManagerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return setLoading(false);

    axios
      .get(`http://localhost:3000/api/users/${savedUser.id}`)
      .then((res) => {
        setUser(res.data);
        setEditForm({
          name: res.data.name,
          phone: res.data.phone,
          address: res.data.address,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/users/${user._id}`, editForm);
      alert("Profile updated successfully!");
      setUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      return alert("New passwords do not match");
    }
    try {
      if (passwordForm.oldPassword !== user.password) {
        return alert("Old password is incorrect");
      }
      const res = await axios.put(`http://localhost:3000/api/users/${user._id}`, {
        password: passwordForm.newPassword,
      });
      alert("Password updated successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found. Please log in again.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      {/* Profile Edit */}
      <form onSubmit={handleProfileUpdate} className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Phone:
          <input
            type="text"
            name="phone"
            value={editForm.phone}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Address:
          <input
            type="text"
            name="address"
            value={editForm.address}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordUpdate} className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Change Password</h2>
        <label className="block mb-2">
          Old Password:
          <input
            type="password"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          New Password:
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Confirm New Password:
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordForm.confirmNewPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
