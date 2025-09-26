// backend/server.js
/**
 * Main server file for the backend Express application.
 * This file sets up the Express server, middleware, routes, and error handling.
 * It also initializes the SQLite database and starts the server.
 */
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database initialization
const { initializeDatabase } = require("./src/database/db");

// Import routes
const employeeRoutes = require("./src/routes/employeeRoutes");

// Create Express application instance
const app = express();

// Set port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// Middleware configuration
// Enable CORS for cross-origin requests from frontend
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_URL, // Allow requests from Next.js frontend
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
// Mount employee routes under /api/employees
app.use("/api/employees", employeeRoutes);

// ((Test route)): Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize SQLite database
    await initializeDatabase();
    console.log("Database initialized successfully");
    console.log("-------------------------------------------");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("-------------------------------------------");
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
      console.log("-------------------------------------------");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Export app for testing
module.exports = app;
