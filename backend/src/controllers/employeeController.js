// Import Employee Model
const EmployeeModel = require("../models/employeeModel");

// Employee Controller
// Handles HTTP requests and responses for employee operations
class EmployeeController {
  // GET /api/employees - Get all employees
  static async getAllEmployees(req, res) {
    try {
      // Extract search query from request
      const { search } = req.query;

      // Fetch employees from database
      const employees = await EmployeeModel.findAll(search);

      // Send successful response with employees data
      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees,
      });
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch employees",
      });
    }
  }

  // GET /api/employees/:id - Get single employee by ID
  static async getEmployeeById(req, res) {
    try {
      // Extract employee ID from URL parameters
      const { id } = req.params;

      // Validate ID is a number
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid employee ID",
        });
      }

      // Fetch employee from database
      const employee = await EmployeeModel.findById(id);

      // Check if employee exists
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      // Send successful response with employee data
      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch employee",
      });
    }
  }

  // POST /api/employees - Create new employee
  static async createEmployee(req, res) {
    try {
      // Extract employee data from request body
      const employeeData = req.body;

      // Validate employee data
      const validationErrors = EmployeeModel.validate(employeeData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: validationErrors,
        });
      }

      // Create employee in database
      const newEmployee = await EmployeeModel.create(employeeData);

      // Send successful response with new employee data
      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: newEmployee,
      });
    } catch (error) {
      console.error("Error in createEmployee:", error);

      // Handle duplicate email error
      if (error.message.includes("Email already exists")) {
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || "Failed to create employee",
      });
    }
  }

  // PUT /api/employees/:id - Update employee
  static async updateEmployee(req, res) {
    try {
      // Extract employee ID and data
      const { id } = req.params;
      const employeeData = req.body;

      // Validate ID is a number
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid employee ID",
        });
      }

      // Validate employee data
      const validationErrors = EmployeeModel.validate(employeeData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          errors: validationErrors,
        });
      }

      // Update employee in database
      const updatedEmployee = await EmployeeModel.update(id, employeeData);

      // Send successful response with updated employee data
      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: updatedEmployee,
      });
    } catch (error) {
      console.error("Error in updateEmployee:", error);

      // Handle not found error
      if (error.message.includes("Employee not found")) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      // Handle duplicate email error
      if (error.message.includes("Email already exists")) {
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || "Failed to update employee",
      });
    }
  }

  // DELETE /api/employees/:id - Delete employee
  static async deleteEmployee(req, res) {
    try {
      // Extract employee ID from URL parameters
      const { id } = req.params;

      // Validate ID is a number
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid employee ID",
        });
      }

      // Delete employee from database
      const deleted = await EmployeeModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      // Send successful response
      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteEmployee:", error);

      // Handle not found error
      if (error.message.includes("Employee not found")) {
        return res.status(404).json({
          success: false,
          error: "Employee not found",
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete employee",
      });
    }
  }
}

// Export the controller
module.exports = EmployeeController;
