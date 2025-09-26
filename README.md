# Employee Management System

A full-stack CRUD (Create, Read, Update, Delete) application to manage employees.
Built with **Next.js (App Router, TypeScript, Tailwind CSS)** on the frontend and **Node.js, Express, SQLite** on the backend.

---

## 🚀 Tech Stack

**Frontend:**

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- Axios for API calls

**Backend:**

- Node.js + Express
- SQLite (`sqlite3`)
- REST API (`/api/employees`)

---

## Features

### ✅ Core Features Completed

**Backend:**

- ✔ Create a full set of CRUD API endpoints for employees (`/api/employees`). An employee has name, email, and position.
- ✔ Use a simple database like SQLite to persist the data.

**Frontend:**

- ✔ Display all employees in a table or list.
- ✔ Provide a form to add a new employee.
- ✔ Include buttons to "Edit" and "Delete" each employee in the list.
- ✔ Editing can be done via a modal or a separate page.

### ✅ Bonus Features Completed

- ✔ Add a search/filter bar on the frontend to find employees by name.
- ✔ Implement frontend form validation.

### ✨ Self-added Features

- ✔ Backend form validation for enhanced data integrity.
- ✔ Modern and responsive frontend for an optimal user experience.
- ✔ Search functionality extended to name, email, and position.
- ✔ Default table sorting from newest to oldest entries.
- ✔ Robust and advanced error handling throughout the application.

## 🗂 Project Structure

```bash
employee-management/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Handles request logic
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   ├── database/          # Database connection/config
│   │   └── tests/             # Test cases
│   ├── package.json
│   └── server.js              # Backend entry point
│
├── frontend/
│   ├── app/
│   │   ├── employees/
│   │   │   ├── page.tsx          # List employees
│   │   │   ├── new/page.tsx      # Add new employee
│   │   │   └── [id]/edit/page.tsx # Edit employee
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   │
│   ├── components/
│   │   ├── EmployeeForm.tsx      # Form component
│   │   └── EmployeeTable.tsx     # Table component
│   │
│   └── .env.local                # Environment variables
```

---

## 🧪 API Endpoints

- **GET** `/api/employees` → List all employees
- **GET** `/api/employees/:id` → Get employee by ID
- **POST** `/api/employees` → Create a new employee
- **PUT** `/api/employees/:id` → Update employee by ID
- **DELETE** `/api/employees/:id` → Delete employee by ID

---

## ⚡ Getting Started

### Backend Setup

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Start the backend server:**

   ```bash
   npm start
   ```

   The backend runs on [http://localhost:5000](http://localhost:5000).

3. **Database:**

   - SQLite database (`employees.db`) is created automatically in the project root.

### Frontend Setup

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure API URL:**

   - Create a `.env.local` file in the frontend directory:

     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```

3. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend runs on [http://localhost:3000](http://localhost:3000).

---

## 🖥 Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the UI to view, add, edit, or delete employees.

---

## 🛠 Scripts

**Backend:**

- `npm start` — Start the Express server

**Frontend:**

- `npm run dev` — Start Next.js in development mode
- `npm run build` — Build the app for production
- `npm run start` — Start Next.js in production mode

---

## 🔧 Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS, Axios, TypeScript
- **Backend:** Node.js, Express, SQLite

---

## 📄 License

MIT

---

**Author:** Ronak Hingonia
