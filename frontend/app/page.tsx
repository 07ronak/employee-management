import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <Link
        href="/employees"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Employees
      </Link>
    </main>
  );
}
