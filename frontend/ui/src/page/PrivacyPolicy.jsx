import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

// Professional icons for policy cards
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import SecurityIcon from "@mui/icons-material/Security";
import ShareIcon from "@mui/icons-material/Share";
import GavelIcon from "@mui/icons-material/Gavel";
import CookieIcon from "@mui/icons-material/Cookie";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const policyCards = [
    {
      title: "Information Collection",
      description:
        "We collect personal data like name, email, phone, and vehicle preferences, plus technical info such as IP and browser data.",
      icon: <AccountCircleIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
    {
      title: "Usage of Data",
      description:
        "We use your data to personalize your experience, improve services, and provide car transaction updates.",
      icon: <InfoIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
    {
      title: "Data Security",
      description:
        "We protect your information with encryption, secure storage, and industry-standard security measures.",
      icon: <SecurityIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
    {
      title: "Third-Party Sharing",
      description:
        "We only share your data with trusted partners for transactions or legal compliance. Never for marketing resale.",
      icon: <ShareIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
    {
      title: "User Rights",
      description:
        "Access, modify, or request deletion of your personal data anytime by contacting our support team.",
      icon: <GavelIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
    {
      title: "Cookies & Tracking",
      description:
        "Cookies help improve user experience and analytics. You can manage them in your browser settings.",
      icon: <CookieIcon sx={{ fontSize: 50, color: "#ffcc00", mb: 2 }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9", color: "#222" }}>
      {/* Navbar */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ backdropFilter: "blur(12px)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
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

      {/* Hero Section */}
      <Box
        sx={{
          height: "40vh",
          backgroundImage:
            "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://www.georgeho.org/old-eigenfoo.github.io/assets/images/cool-backgrounds/cool-background5.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Privacy Policy
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 600, mx: "auto", color: "#eee" }}>
            Protecting your personal information is our top priority at A-A Auto Mart.
          </Typography>
        </motion.div>
      </Box>

      {/* Horizontal Policy Cards */}
      <Container sx={{ py: 10, overflowX: "auto", display: "flex", gap: 3 }}>
        {policyCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            style={{ minWidth: 300 }}
          >
            <Card
              sx={{
                p: 4,
                borderRadius: 4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                textAlign: "center",
                "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
              }}
            >
              {card.icon}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ color: "#555", lineHeight: 1.6 }}>{card.description}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#0d0d1a", color: "#fff", py: 6 }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography sx={{ mb: 2 }}>info@aaautomart.lk | +94 77 123 4567 | Colombo, Sri Lanka</Typography>
          <Box sx={{ mt: 2 }}>
            {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
              <motion.div key={i} whileHover={{ scale: 1.2 }} style={{ display: "inline-block", mx: 1 }}>
                <IconButton href="#" sx={{ color: "#fff" }}>
                  <Icon />
                </IconButton>
              </motion.div>
            ))}
          </Box>
          <Typography sx={{ mt: 3, fontSize: 14 }}>&copy; 2025 A-A Auto Mart. All Rights Reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
