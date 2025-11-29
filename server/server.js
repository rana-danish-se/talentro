import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./configs/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import profileRoutes from "./routes/profile.route.js";

import educationRoutes from "./routes/education.route.js";
import experienceRoutes from "./routes/experience.route.js";
import projectRoutes from "./routes/project.route.js";
import skillRoutes from "./routes/skill.route.js";
import postRoutes from "./routes/post.route.js";
import feedRoutes from "./routes/feed.route.js";
import savedPostRoutes from "./routes/savedPost.route.js";

// Load environment variables
configDotenv();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Talentro API Server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API routes will be added here
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/saved-posts", savedPostRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Local: http://localhost:${PORT}`);
});
