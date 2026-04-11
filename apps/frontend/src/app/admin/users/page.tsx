"use client";

import { useCallback, useEffect, useState } from "react";

import { User } from "@/app/types/blog";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAppContext } from "@/contexts/AppProvider";
import { listUsers, updateUserRole } from "@/lib/admin";

export default function AdminUsersPage() {
  const { token } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async (nextPage: number, nextQuery: string) => {
    if (!token) return;

    try {
      const response = await listUsers(token, nextPage, nextQuery);
      setUsers(response.items);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers(page, query);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadUsers, page, query]);

  const handleRoleChange = async (userId: number, role: "admin" | "author") => {
    if (!token) return;
    setError("");

    try {
      await updateUserRole(token, userId, role);
      await loadUsers(page, query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user role.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <ProtectedRoute roles={["admin"]}>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Search users, page through the results, and update roles between author
            and admin.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or email"
              className="flex-1 rounded-lg border px-4 py-2"
            />
            <button
              onClick={() => {
                setPage(1);
                setQuery(search);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Search
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        void handleRoleChange(
                          user.id,
                          e.target.value as "admin" | "author"
                        )
                      }
                      className="rounded border px-2 py-1"
                    >
                      <option value="author">author</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page >= totalPages}
            className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-50 dark:bg-gray-700"
          >
            Next
          </button>
        </div>
      </section>
    </ProtectedRoute>
  );
}
