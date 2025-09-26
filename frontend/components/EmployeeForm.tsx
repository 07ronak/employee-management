"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Employee = {
  id?: number;
  name: string;
  email: string;
  position: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  position?: string;
};

export default function EmployeeForm({
  initialData,
}: {
  initialData?: Employee;
}) {
  const [form, setForm] = useState<Employee>(
    initialData || { name: "", email: "", position: "" }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must not exceed 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim()))
      return "Name must contain only letters and spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return "Please enter a valid email address";
    if (email.length > 100) return "Email must not exceed 100 characters";
    return undefined;
  };

  const validatePosition = (position: string): string | undefined => {
    if (!position.trim()) return "Position is required";
    if (position.trim().length < 2)
      return "Position must be at least 2 characters";
    if (position.trim().length > 50)
      return "Position must not exceed 50 characters";
    return undefined;
  };

  const validateForm = (): boolean => {
    //Checks all fields at once before submitting
    const newErrors: FormErrors = {};

    const nameError = validateName(form.name);
    const emailError = validateEmail(form.email);
    const positionError = validatePosition(form.position);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (positionError) newErrors.position = positionError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Updates form data as user types, clears errors
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Validates a field when user clicks away from it
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error: string | undefined;

    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "position":
        error = validatePosition(value);
        break;
    }

    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    //Determines if this is creating a new employee or updating existing one
    try {
      if (form.id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/employees/${form.id}`,
          form
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employees`, form);
      }
      router.push("/employees"); // Redirect to employee list after success
    } catch (error: any) {
      // Handle server-side validation errors
      if (error.response?.status === 400) {
        const serverErrors = error.response.data.errors || [];
        const newErrors: FormErrors = {};

        serverErrors.forEach((err: string) => {
          if (err.includes("name") || err.includes("Name")) {
            newErrors.name = err;
          } else if (err.includes("email") || err.includes("Email")) {
            newErrors.email = err;
          } else if (err.includes("position") || err.includes("Position")) {
            newErrors.position = err;
          }
        });

        setErrors(newErrors);
      } else if (error.response?.status === 409) {
        setErrors({ email: "Email already exists" });
      } else {
        alert("An error occurred while saving the employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border p-2 rounded ${
            errors.name
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          } focus:outline-none focus:ring-1 ${
            errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border p-2 rounded ${
            errors.email
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          } focus:outline-none focus:ring-1 ${
            errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full border p-2 rounded ${
            errors.position
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          } focus:outline-none focus:ring-1 ${
            errors.position ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
          required
        />
        {errors.position && (
          <p className="text-red-500 text-sm mt-1">{errors.position}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed ${
          isSubmitting ? "opacity-50" : ""
        }`}
      >
        {isSubmitting ? "Saving..." : form.id ? "Update" : "Create"}
      </button>
    </form>
  );
}
