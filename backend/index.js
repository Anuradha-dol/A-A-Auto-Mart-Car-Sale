const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dbConnection = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const carsRoute = require("./routes/vehicles");
const vehiclePartsRoute = require("./routes/vehicleParts");
const  vehicleMechanicWorksRoute = require("./routes/vehicleMechanicWorks");
const orderRoutes = require("./routes/order");
const mTickert = require("./routes/MTickert");
const salaryRoute = require("./routes/salaryRoutes");
const leaveRequest = require("./routes/leaveRequest");
const meca = require("./routes/vehicleMechanicWorks");
const payment= require("./routes/payment");
const reviewRouter = require("./routes/ReviewRoute");
const ticketRouter = require("./routes/TicketRoute");
const replyRouter = require("./routes/ReplyRoute");
const analyzeRoute = require("./routes/Analyze");
const authRoute = require("./routes/AuthRoute");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
dbConnection();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Serve uploads
app.use("/uploads", express.static(uploadsDir));


// Test route
app.get("/", (req, res) => res.send("Hello, Server is Running.."));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/cars", carsRoute);
app.use("/api/orders", orderRoutes);


app.use("/api/tik",mTickert);

app.use("/api/vehicleparts", vehiclePartsRoute);
app.use("/api/vehiclemechanicworks", vehicleMechanicWorksRoute);

app.use("/api/salary",salaryRoute);
app.use("/api/levave",leaveRequest);

app.use("/api/meca", meca);
app.use("/api/payment",payment);

// Review and support 
app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/reply",replyRouter);
app.use("/api/analyze", analyzeRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
