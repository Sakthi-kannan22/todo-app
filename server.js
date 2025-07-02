// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const cookieParser = require("cookie-parser");
// const { Server } = require("socket.io");
// const http = require("http");

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const taskRoutes = require("./routes/taskRoutes");

// const app = express();

// connectDB();

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use(session({
//   secret: "secret",
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     credentials: true
//   }
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("taskUpdated", (data) => {
//     socket.broadcast.emit("refreshTasks", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// server.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
// require('dotenv').config(); // Load the .env file



// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const taskRoutes = require('./routes/taskRoutes');

app.use(cors());
app.use(express.json());

// mount routes
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
