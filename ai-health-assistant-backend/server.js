// server.js - Refactored main server file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const {
  generalLimiter,
  analysisLimiter,
  hospitalLimiter,
} = require("./middleware/rateLimiter");
const analysisRoutes = require("./routes/analysisRoutes");
const createLocationRoutes = require("./routes/locationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(generalLimiter); // Apply general rate limiting to all routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Health Assistant Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/", analysisLimiter, analysisRoutes); // Apply analysis rate limiting
app.use("/", hospitalLimiter, createLocationRoutes(process.env.gmaps_API_KEY)); // Apply hospital rate limiting

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Health Assistant Backend running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);

  // Validate environment variables
  if (!process.env.gmaps_API_KEY) {
    console.warn(
      "⚠️  Warning: Google Maps API key not found in environment variables"
    );
  }

  let geminiKeyCount = 0;
  for (let i = 1; i <= 20; i++) {
    if (process.env[`gemini_API_KEY_${i}`]) {
      geminiKeyCount++;
    }
  }

  if (geminiKeyCount === 0) {
    console.warn(
      "⚠️  Warning: No Gemini API keys found in environment variables"
    );
  } else {
    console.log(`🔑 Found ${geminiKeyCount} Gemini API keys`);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

module.exports = app;
