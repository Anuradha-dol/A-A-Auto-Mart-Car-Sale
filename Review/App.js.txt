// pass = J6ATIV2whNZLirTz
const express = require("express");
const mongoose = require("mongoose");
const reviewRouter = require("./Route/ReviewRoute");
const ticketRouter = require("./Route/TicketRoute");
const replyRouter = require("./Route/ReplyRoute");
const analyzeRoute = require("./Route/Analyze");
const userRouter = require("./Route/UserRoute");
const authRoute = require("./Route/AuthRoute");

const app = express();
const cors = require("cors");
//middle ware
app.use(express.json());
app.use(cors());

app.use("/user",userRouter)
app.use("/auth", authRoute);
app.use("/reviews", reviewRouter);
app.use("/tickets", ticketRouter);
app.use("/reply",replyRouter);
app.use("/analyze", analyzeRoute);

mongoose.connect("mongodb+srv://admin:J6ATIV2whNZLirTz@cluster0.aif611n.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then (()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));