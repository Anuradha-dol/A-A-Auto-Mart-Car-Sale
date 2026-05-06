import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  IconButton,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { motion } from "framer-motion";

export default function AboutUs() {
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const storyRef = useRef(null);
  const specialRef = useRef(null);
  const extraRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: "#111" }} />,
      title: "Trusted Platform",
      desc: "Thousands of verified sellers and buyers trust us for safe, transparent transactions.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: "#111" }} />,
      title: "Fast & Easy",
      desc: "List your car or find one within minutes using our smart, streamlined platform.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: "#111" }} />,
      title: "24/7 Support",
      desc: "Our professional team is always here to assist with queries and after-sale support.",
    },
  ];

  const extraFeatures = [
    {
      icon: <DirectionsCarIcon sx={{ fontSize: 50, color: "#4caf50" }} />,
      title: "Extensive Inventory",
      desc: "Thousands of cars available with detailed listings and clear photos.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 50, color: "#4caf50" }} />,
      title: "Trusted Clients",
      desc: "Join a community of satisfied buyers and sellers across Sri Lanka.",
    },
    {
      icon: <StarIcon sx={{ fontSize: 50, color: "#4caf50" }} />,
      title: "Top Ratings",
      desc: "High customer satisfaction with verified reviews for every transaction.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#fafafa", color: "#222", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/743/743131.png"
              alt="Logo"
              style={{ width: 40, height: 40 }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: 1.5 }}
            >
              A-A Auto Mart
            </Typography>
          </Box>

          <Box>
            {[
              { label: "Home", ref: heroRef, scroll: true },
              { label: "Features", ref: featuresRef, scroll: true },
              { label: "Our Story", ref: storyRef, scroll: true },
              { label: "Highlights", ref: specialRef, scroll: true },
              { label: "Extras", ref: extraRef, scroll: true },
              { label: "Contact Us", path: "/contactUspage" },
              { label: "Privacy Policy", path: "/privacypolicy" },
              { label: "About Us", path: "/aboutus" },
            ].map((item, i) =>
              item.scroll ? (
                <Button
                  key={i}
                  onClick={() => scrollToSection(item.ref)}
                  sx={{
                    mx: 1,
                    borderRadius: "50px",
                    px: 2.5,
                    textTransform: "none",
                    background: "#4caf50",
                    color: "#fff",
                    "&:hover": { background: "#43a047" },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={i}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    borderRadius: "50px",
                    px: 2.5,
                    textTransform: "none",
                    background: "#4caf50",
                    color: "#fff",
                    "&:hover": { background: "#43a047" },
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            sx={{ color: "#fff", fontWeight: 800, mb: 2 }}
          >
            Drive Your Dream Car
          </Typography>
          <Typography
            sx={{ color: "#fff", maxWidth: 700, mx: "auto", mb: 3 }}
          >
            Explore the best car deals in Sri Lanka with A-A Auto Mart.
            Connecting buyers and sellers seamlessly with trust and transparency.
          </Typography>

          {/* Navigate to /login */}
          <Button
            onClick={() => navigate("/login")}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: "50px",
              background: "#4caf50",
              color: "#fff",
              textTransform: "none",
              "&:hover": { background: "#0d0e0dff", transform: "translateY(-3px)" },
              transition: "all 0.3s ease",
            }}
          >
            Explore Cars
          </Button>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Container ref={featuresRef} sx={{ py: 10, overflowX: "auto" }}>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "nowrap" }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Card
                sx={{
                  p: 4,
                  minWidth: 280,
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  "&:hover": { transform: "translateY(-6px)" },
                  transition: "0.3s",
                }}
              >
                {f.icon}
                <Typography
                  variant="h6"
                  sx={{ mt: 2, fontWeight: 700 }}
                >
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                  {f.desc}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Our Story Section */}
      <Container ref={storyRef} sx={{ py: 10 }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Our Story
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#555", lineHeight: 1.7 }}>
            Founded in 2022, A-A Auto Mart started as a small initiative in
            Colombo, Sri Lanka to simplify car buying and selling. With
            dedication, professionalism, and transparency, we now connect
            thousands of buyers and sellers across the country.
          </Typography>
        </motion.div>
      </Container>

      {/* Special Highlights Section */}
      <Box
        ref={specialRef}
        sx={{
          position: "relative",
          height: "70vh",
          backgroundImage:
            "url('https://www.georgeho.org/old-eigenfoo.github.io/assets/images/cool-backgrounds/cool-background5.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Box
          sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
            Experience Excellence
          </Typography>
          <Typography sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
            Our professional approach ensures that every transaction is seamless,
            safe, and satisfactory. Discover the difference with A-A Auto Mart
            today.
          </Typography>
          <Button
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: "50px",
              background: "#4caf50",
              color: "#fff",
              textTransform: "none",
              "&:hover": { background: "#43a047" },
            }}
          >
            Learn More
          </Button>
        </motion.div>
      </Box>

      {/* Extra Special Features Section */}
      <Container ref={extraRef} sx={{ py: 10 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 6, textAlign: "center" }}
        >
          Special Features
        </Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "nowrap", overflowX: "auto" }}>
          {extraFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <Card
                sx={{
                  p: 4,
                  minWidth: 280,
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                  "&:hover": { transform: "translateY(-6px)" },
                  transition: "0.3s",
                }}
              >
                {f.icon}
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "#555" }}>
                  {f.desc}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1e1e2f", color: "#fff", py: 6 }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography sx={{ mb: 2 }}>
            info@aaautomart.lk | +94 77 123 4567 | Colombo, Sri Lanka
          </Typography>
          <Box sx={{ mt: 2 }}>
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
