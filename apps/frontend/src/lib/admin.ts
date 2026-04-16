import { apiRequest } from "@/lib/apiClient";
import { User } from "@/app/types/blog";

type PaginatedUsers = {
  items: User[];
  total: number;
  page: number;
  page_size: number;
};

export function listUsers(page: number, search: string) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: "10",
  });

  if (search.trim()) {
    query.set("search", search.trim());
  }

  return apiRequest<PaginatedUsers>(`/admin/users?${query.toString()}`);
}

export function updateUserRole(
  userId: number,
  role: "admin" | "author"
) {
  return apiRequest<User>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}