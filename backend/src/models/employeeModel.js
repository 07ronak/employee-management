// Import database utility functions
const { runQuery, getOne, getAll } = require("../database/db");

// Employee Model Class
// Handles all database operations related to employees
class EmployeeModel {
  // Get all employees from database
  // Optional search parameter to filter by name
  static async findAll(search = "") {
    try {
      let sql = "SELECT * FROM employees";
      let params = [];

      // Add search filter if provided
      if (search) {
        sql += " WHERE name LIKE ?";
        params.push(`%${search}%`);
      }

      sql += " ORDER BY created_at DESC";

      // Execute query and return results
      const employees = await getAll(sql, params);
      return employees;
    } catch (error) {
      throw new Error(`Error fetching employees: ${error.message}`);
    }
  }

  // Find single employee by ID
  static async findById(id) {
    try {
      const sql = "SELECT * FROM employees WHERE id = ?";
      const employee = await getOne(sql, [id]);
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee: ${error.message}`);
    }
  }

  // Find employee by email (used for checking duplicates)
  static async findByEmail(email) {
    try {
      const sql = "SELECT * FROM employees WHERE email = ?";
      const employee = await getOne(sql, [email]);
      return employee;
    } catch (error) {
      throw new Error(`Error finding employee by email: ${error.message}`);
    }
  }

  // Create new employee
  static async create(employeeData) {
    try {
      const { name, email, position } = employeeData;

      // Check if email already exists
      const existingEmployee = await this.findByEmail(email);
      if (existingEmployee) {
        throw new Error("Email already exists");
      }

      // Insert new employee into database
      const sql =
        "INSERT INTO employees (name, email, position) VALUES (?, ?, ?)";
      const result = await runQuery(sql, [name, email, position]);

      // Return the newly created employee
      return await this.findById(result.id);
    } catch (error) {
      throw new Error(`Error creating employee: ${error.message}`);
    }
  }

  // Update existing employee
  static async update(id, employeeData) {
    try {
      const { name, email, position } = employeeData;

      // Check if employee exists
      const employee = await this.findById(id);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Check if new email is already taken by another employee
      if (email !== employee.email) {
        const existingEmployee = await this.findByEmail(email);
        if (existingEmployee) {
          throw new Error("Email already exists");
        }
      }

      // Update employee in database
      const sql = `
                UPDATE employees 
                SET name = ?, email = ?, position = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
      await runQuery(sql, [name, email, position, id]);

      // Return updated employee
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }

  // Delete employee by ID
  static async delete(id) {
    try {
      // Check if employee exists
      const employee = await this.findById(id);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Delete employee from database
      const sql = "DELETE FROM employees WHERE id = ?";
      const result = await runQuery(sql, [id]);

      // Return true if deletion was successful
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  // Validate employee data
  static validate(employeeData) {
    const errors = [];

    // Validate Name
    if (!employeeData.name || !employeeData.name.trim()) {
      errors.push("Name is required");
    } else {
      const trimmedName = employeeData.name.trim();
      if (trimmedName.length < 2) {
        errors.push("Name must be at least 2 characters");
      }
      if (trimmedName.length > 50) {
        errors.push("Name must not exceed 50 characters");
      }
      if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
        errors.push("Name must contain only letters and spaces");
      }
    }

    // Validate Email
    if (!employeeData.email || !employeeData.email.trim()) {
      errors.push("Email is required");
    } else {
      const trimmedEmail = employeeData.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.push("Please enter a valid email address");
      }
      if (employeeData.email.length > 100) {
        errors.push("Email must not exceed 100 characters");
      }
    }

    // Validate Position
    if (!employeeData.position || !employeeData.position.trim()) {
      errors.push("Position is required");
    } else {
      const trimmedPosition = employeeData.position.trim();
      if (trimmedPosition.length < 2) {
        errors.push("Position must be at least 2 characters");
      }
      if (trimmedPosition.length > 50) {
        errors.push("Position must not exceed 50 characters");
      }
    }

    return errors;
  }
}

// Export the model
module.exports = EmployeeModel;
