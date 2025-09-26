"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import EmployeeTable from "../../components/EmployeeTable";

type Employee = { id: number; name: string; email: string; position: string };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/employees`
      );
      setEmployees(res.data.data);
      setFilteredEmployees(res.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search term
  const filterEmployees = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchTerm]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleRefresh = () => {
    fetchEmployees();
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link
          href="/employees/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add Employee
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name, email, or position..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            {filteredEmployees.length === 0 ? (
              <span>No employees found for "{searchTerm}"</span>
            ) : (
              <span>
                Showing {filteredEmployees.length} of {employees.length}{" "}
                employees
                {filteredEmployees.length !== employees.length &&
                  ` matching "${searchTerm}"`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading employees...</span>
        </div>
      ) : (
        <>
          {filteredEmployees.length === 0 &&
          employees.length > 0 &&
          searchTerm ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No employees found
              </div>
              <p className="text-gray-400">
                Try adjusting your search criteria or{" "}
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  clear the search
                </button>
              </p>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No employees yet</div>
              <p className="text-gray-400 mb-4">
                Get started by adding your first employee
              </p>
              <Link
                href="/employees/new"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Add First Employee
              </Link>
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              refresh={handleRefresh}
            />
          )}
        </>
      )}
    </main>
  );
}
