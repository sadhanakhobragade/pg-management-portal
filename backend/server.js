require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(require("cors")());

// Basic Route to check if server is running
app.get("/", (req, res) => {
  res.send("PG Management API Running");
});

// NEW: health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const authRoutes = require("./routes/authRoutes");
const portalRoutes = require("./routes/portalRoutes");

app.use("/api/auth", authRoutes); // Handles login, signup, and user management
app.use("/api/portal", portalRoutes); // Handles rooms, complaints, and general data

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
