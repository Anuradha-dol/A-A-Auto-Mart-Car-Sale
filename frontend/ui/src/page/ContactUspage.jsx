import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.message) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Message submitted!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", color: "#222" }}>
      {/* Navbar */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "blur(12px)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/743/743131.png"
              alt="Logo"
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111" }}>
              A-A Auto Mart
            </Typography>
          </Box>
          <Box>
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/aboutus" },
            
              { label: "Privacy Policy", path: "/privacypolicy" },
              { label: "Contact", path: "/contactUspage" },
            ].map((item, i) => (
              <Button
                key={i}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "#111",
                  fontWeight: 500,
                  mx: 1,
                  borderRadius: "30px",
                  px: 2.5,
                  textTransform: "none",
                  "&:hover": { background: "#111", color: "#fff" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Page Title */}
      <Box sx={{ py: 8, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Contact Us
          </Typography>
          <Typography sx={{ maxWidth: 600, mx: "auto", color: "#555" }}>
            Have questions or want to reach out? We’re here to help. Contact our team today!
          </Typography>
        </motion.div>
      </Box>

      {/* Contact Info + Form + Map */}
      <Container sx={{ pb: 10 }}>
        <Grid container spacing={6}>
          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2, color: "#fbc02d" }} />
                  <Typography>+94 77 123 4567</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon sx={{ mr: 2, color: "#fbc02d" }} />
                  <Typography>info@aaautomart.lk</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ mr: 2, color: "#fbc02d" }} />
                  <Typography>Galle, Sri Lanka</Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  height: "100%",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.082387104552!2d80.21706457431128!3d6.032479224119528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae17792a6f144a9%3A0xf0b3b1c22812c9f0!2sGalle%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1697271885662!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 360 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Galle Map"
                ></iframe>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Social Media Footer */}
      <Box sx={{ bgcolor: "#1e1e2f", color: "#fff", py: 6 }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Follow Us
          </Typography>
          <Box>
            <IconButton href="#" sx={{ color: "#fff" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href="#" sx={{ color: "#fff" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href="#" sx={{ color: "#fff" }}>
              <TwitterIcon />
            </IconButton>
          </Box>
          <Typography sx={{ mt: 3, fontSize: 14 }}>
            &copy; 2025 A-A Auto Mart. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
