import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      const user = res.data?.user || {};
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", (user.role || "").trim());
      localStorage.setItem("userId", (user._id || user.id || "").trim());

      const role = (user.role || "").trim();
      if (role === "Support_Manager" || role === "CustomerCareOfficer") {
        navigate("/care-dashboard");
        return;
      }

      switch (res.data.user.role) {
        case "customer":
          navigate("/customer-dashboard");
          break;
        case "manager":
          navigate("/vehicleManager-dashboard");
          break;
        case "EmployeeManager":
          navigate("/employeeManagerDashboard-dashboard");
          break;
        case "PaymentManager":
          navigate("/paymentManager-dashboard");
          break;
        case "UserManager":
          navigate("/usermanager");
          break;
        case "VehicleMechanic":
          navigate("/vehicleMechanic-dashboard");
          break;
        case "VehiclePartsManager":
          navigate("/vehicleParts-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
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
          sx={{
            p: 5,
            borderRadius: "20px",
            width: 400,
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
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#555" }}>
            Login to your account
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

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
            </Button>
          </form>

          <Typography
            sx={{
              mt: 3,
              fontSize: 14,
              color: "#444",
            }}
          >
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#4caf50",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Up
            </span>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
