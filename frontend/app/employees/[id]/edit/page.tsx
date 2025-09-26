"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import EmployeeForm from "../../../../components/EmployeeForm";

type Employee = { id: number; name: string; email: string; position: string };

export default function EditEmployeePage() {
  const { id } = useParams() as { id: string };
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`)
        .then((res) => setEmployee(res.data.data));
    }
  }, [id]);

  if (!employee) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Employee</h1>
      <EmployeeForm initialData={employee} />
    </main>
  );
}
