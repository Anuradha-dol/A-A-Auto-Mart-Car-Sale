import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import "./Signup.css";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers/symbols in name
    if (name === "name") {
      const validName = value.replace(/[^A-Za-z\s]/g, "");
      setForm((prev) => ({ ...prev, [name]: validName }));
      return;
    }

    // Allow only digits for phone
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); // remove non-digits
      setForm((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (form.phone && form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    const userID = "USR" + Date.now();

    try {
      const newUser = { ...form, role: "customer", userID };
      const res = await axios.post("http://localhost:3000/api/users", newUser);

      alert(`Customer created successfully! UserID: ${res.data.userID}`);
      navigate("/login");
    } catch (err) {
      console.error("Error creating customer:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create customer");
    }
  };

  return (
    <Box
      className="customer-page"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={6}
          className="customer-card"
          sx={{
            p: 5,
            borderRadius: "20px",
            width: 450,
            maxWidth: "90%",
            textAlign: "center",
            bgcolor: "#fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#4caf50",
              mb: 1,
              letterSpacing: 0.5,
            }}
          >
            Add New Customer
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#555" }}>
            Create your account
          </Typography>

          {error && (
            <Typography
              sx={{
                color: "red",
                fontSize: 14,
                mb: 2,
                bgcolor: "#ffebee",
                borderRadius: 1,
                p: 1,
              }}
            >
              {error}
            </Typography>
          )}

          <form className="customer-form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              required
            />
            <TextField
              fullWidth
              label="Phone (10 digits)"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              variant="outlined"
              inputProps={{ maxLength: 10 }}
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                py: 1.5,
                fontWeight: "bold",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "#43a047" },
              }}
            >
              Add Customer
            </Button>

            <Typography sx={{ mt: 3, fontSize: 14, color: "#444" }}>
              Already have an account?{" "}
              <span
                className="signup-login-link"
                onClick={() => navigate("/login")}
                style={{
                  color: "#4caf50",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </span>
            </Typography>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
