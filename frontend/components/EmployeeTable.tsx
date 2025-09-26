"use client";
import Link from "next/link";
import axios from "axios";
import { useRef, useState } from "react";

type Employee = {
  id: number;
  name: string;
  email: string;
  position: string;
};

export default function EmployeeTable({
  employees,
  refresh,
}: {
  employees: Employee[];
  refresh: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openDialog = (id: number) => {
    setDeleteId(id);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setDeleteId(null);
    dialogRef.current?.close();
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/employees/${deleteId}`
      );
      refresh();
      closeDialog();
    }
  };

  return (
    <>
      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-black">ID</th>
            <th className="p-2 border text-black">Name</th>
            <th className="p-2 border text-black">Email</th>
            <th className="p-2 border text-black">Position</th>
            <th className="p-2 border text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="text-center">
              <td className="p-2 border">{emp.id}</td>
              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.email}</td>
              <td className="p-2 border">{emp.position}</td>
              <td className="p-2 border space-x-2">
                <Link
                  href={`/employees/${emp.id}/edit`}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => openDialog(emp.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 shadow-xl bg-white max-w-md w-full 
           fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <p className="text-lg font-medium mb-4">
          Are you sure you want to delete this employee data?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeDialog}
            className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
}
