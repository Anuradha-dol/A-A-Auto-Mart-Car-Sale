import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  Box,
  Grid,
  Avatar,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupIcon from "@mui/icons-material/Group";
import BuildIcon from "@mui/icons-material/Build";
import PersonIcon from "@mui/icons-material/Person";
import SupportIcon from "@mui/icons-material/Support";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function AboutUs() {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <Box sx={{ bgcolor: "#fafafa", color: "#222", minHeight: "100vh" }}>
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

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "60vh",
          backgroundImage: `url('https://wallpaperaccess.com/full/1567666.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ zIndex: 2 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            About A-A Auto Mart
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 700, mx: "auto", color: "#eee", lineHeight: 1.6 }}
          >
            Connecting buyers and sellers in Sri Lanka, making car sales easy, secure, and
            transparent. Meet our team and see how we deliver excellence.
          </Typography>
        </motion.div>
      </Box>

      {/* Our Story Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"
              alt="Our Story"
              style={{ width: "100%", borderRadius: 16 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Our Story
              </Typography>
              <Typography sx={{ fontSize: "1rem", color: "#555", lineHeight: 1.7 }}>
                Founded in 2022, A-A Auto Mart began as a passion project in Sri Lanka to simplify
                car buying and selling. Our mission is to connect buyers and sellers with
                transparency, professional support, and a seamless experience. Today, we
                continue to help thousands of Sri Lankans find their dream cars every year.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "Vehicle Manager", role: "Engineering & Vehicles", image: "https://randomuser.me/api/portraits/men/32.jpg" },
              { name: "Employee Manager", role: "HR & Operations", image: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Vehicle Parts Manager", role: "Parts & Maintenance", image: "https://randomuser.me/api/portraits/men/52.jpg" },
              { name: "User Manager", role: "Customer Management", image: "https://randomuser.me/api/portraits/women/65.jpg" },
              { name: "Customer Care Manager", role: "Support & Service", image: "https://randomuser.me/api/portraits/men/75.jpg" },
            ].map((member, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <motion.div initial="hidden" whileInView="visible" custom={i} variants={fadeUp}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 4,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                      "&:hover": { transform: "translateY(-5px)", transition: "0.3s" },
                    }}
                  >
                    <Avatar src={member.image} alt={member.name} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{member.name}</Typography>
                    <Typography sx={{ color: "#777", fontSize: 14 }}>{member.role}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 10, textAlign: "center", background: "linear-gradient(135deg, #1e1e2f 0%, #2c2c3f 100%)" }}>
        <Container>
          <Grid container spacing={6} justifyContent="center">
            {[
              { icon: <DirectionsCarIcon sx={{ fontSize: 50, color: "#FFD700" }} />, number: "12K+", label: "Cars Sold" },
              { icon: <PeopleIcon sx={{ fontSize: 50, color: "#FFD700" }} />, number: "25K+", label: "Happy Clients" },
              { icon: <StarIcon sx={{ fontSize: 50, color: "#FFD700" }} />, number: "4.9★", label: "Customer Rating" },
            ].map((stat, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <motion.div initial="hidden" whileInView="visible" custom={i} variants={fadeUp}>
                  <Card
                    sx={{
                      py: 6,
                      px: 4,
                      minWidth: 300,
                      borderRadius: 4,
                      backgroundColor: "rgba(25, 160, 181, 0.1)",
                      backdropFilter: "blur(6px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                      textAlign: "center",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: "#FFD700" }}>{stat.number}</Typography>
                    <Typography variant="h6" sx={{ color: "#fff" }}>{stat.label}</Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Users Section */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6 }}>Our Users</Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { name: "Buyers", icon: <PeopleIcon sx={{ fontSize: 50 }} />, desc: "Find your dream car with ease." },
            { name: "Sellers", icon: <DirectionsCarIcon sx={{ fontSize: 50 }} />, desc: "List and sell your car quickly." },
            { name: "Car Enthusiasts", icon: <StarIcon sx={{ fontSize: 50 }} />, desc: "Explore and follow the latest trends." },
          ].map((user, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div initial="hidden" whileInView="visible" custom={i} variants={fadeUp}>
                <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                  <Box sx={{ mb: 2 }}>{user.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography sx={{ color: "#555" }}>{user.desc}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, textAlign: "center", bgcolor: "#fafafa" }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 6 }}>What Our Clients Say</Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 3,
              px: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {[
              { text: "Buying my first car was seamless with A-A Auto Mart. The team was incredibly supportive!", name: "Emily Carter", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
              { text: "Excellent service and great deals. I sold my car faster than I expected.", name: "David Lee", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
              { text: "Trustworthy and easy to navigate — definitely recommend for any car purchase.", name: "Sophia Martinez", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
              { text: "The customer support is amazing! Quick responses and very helpful.", name: "Michael Brown", avatar: "https://randomuser.me/api/portraits/men/35.jpg" },
            ].map((review, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" custom={i} variants={fadeUp} style={{ minWidth: 300 }}>
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
                  <Avatar src={review.avatar} alt={review.name} sx={{ width: 60, height: 60, mx: "auto", mb: 2 }} />
                  <Typography sx={{ fontStyle: "italic", mb: 2, color: "#555" }}>“{review.text}”</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{review.name}</Typography>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1e1e2f", color: "#fff", py: 6 }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
          <Typography sx={{ mb: 2 }}>info@aaautomart.lk | +94 77 123 4567 | Colombo, Sri Lanka</Typography>
          <Box sx={{ mt: 2 }}>
            <IconButton href="#" sx={{ color: "#fff" }}><FacebookIcon /></IconButton>
            <IconButton href="#" sx={{ color: "#fff" }}><InstagramIcon /></IconButton>
            <IconButton href="#" sx={{ color: "#fff" }}><TwitterIcon /></IconButton>
          </Box>
          <Typography sx={{ mt: 3, fontSize: 14 }}>&copy; 2025 A-A Auto Mart. All Rights Reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
