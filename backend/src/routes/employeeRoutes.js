// Import Express Router
const express = require("express");
const router = express.Router();

// Import Employee Controller
const EmployeeController = require("../controllers/employeeController");

// Define Employee Routes
// All routes are prefixed with /api/employees from server.js

router.get("/", EmployeeController.getAllEmployees);

router.get("/:id", EmployeeController.getEmployeeById);

router.post("/", EmployeeController.createEmployee);

router.put("/:id", EmployeeController.updateEmployee);

router.delete("/:id", EmployeeController.deleteEmployee);

// Export the router
module.exports = router;
