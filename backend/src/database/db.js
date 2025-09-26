// Import SQLite3 with verbose output for better debugging
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database file path - stores database in project root
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "../../employees.db");

// Create a new database connection
// This creates the file if it doesn't exist
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("!Error opening database:", err.message);
  } else {
    console.log("-------------------------------------------");
    console.log("Connected to SQLite database");
    console.log("-------------------------------------------");
  }
});

// Initialize database with employees table
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // SQL command to create employees table if it doesn't exist
    const createTableSQL = `
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                position TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Execute the create table command
    db.run(createTableSQL, (err) => {
      if (err) {
        console.error("!Error creating table:", err.message);
        reject(err);
      } else {
        console.log("Employees table ready");
        console.log("-------------------------------------------");

        // Add some sample data if table is empty
        db.get("SELECT COUNT(*) as count FROM employees", (err, row) => {
          if (err) {
            console.error("Error checking employee count:", err);
            resolve();
          } else if (row.count === 0) {
            // Insert sample data for testing
            const sampleData = [
              ["John Doe", "john.doe@example.com", "Software Engineer"],
              ["Jane Smith", "jane.smith@example.com", "Product Manager"],
              ["Bob Johnson", "bob.johnson@example.com", "UX Designer"],
            ];

            const insertSQL =
              "INSERT INTO employees (name, email, position) VALUES (?, ?, ?)";

            sampleData.forEach((employee) => {
              db.run(insertSQL, employee, (err) => {
                if (err) {
                  console.error("Error inserting sample data:", err);
                }
              });
            });

            console.log("Sample data inserted");
            console.log("---------------------------------------------------");
          }
          resolve();
        });
      }
    });
  });
};

// Utility function to run database queries with promises
// Makes it easier to work with async/await syntax
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        // 'this' contains info about the query execution
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Utility function to get single row from database
const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Utility function to get multiple rows from database
const getAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Export database and utility functions
module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getOne,
  getAll,
};
