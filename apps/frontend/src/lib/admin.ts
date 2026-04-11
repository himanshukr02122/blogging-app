import { User } from "@/app/types/blog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type PaginatedUsers = {
  items: User[];
  total: number;
  page: number;
  page_size: number;
};

async function request<T>(
  path: string,
  token: string,
  options?: { method?: string; payload?: unknown }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: options?.payload ? JSON.stringify(options.payload) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data && typeof data.detail === "string"
        ? data.detail
        : "Unable to complete the request.";
    throw new Error(message);
  }

  return data as T;
}

export function listUsers(token: string, page: number, search: string) {
  const query = new URLSearchParams({
    page: String(page),
    page_size: "10",
  });
  if (search.trim()) {
    query.set("search", search.trim());
  }

  return request<PaginatedUsers>(`/admin/users?${query.toString()}`, token);
}

export function updateUserRole(token: string, userId: number, role: "admin" | "author") {
  return request<User>(`/admin/users/${userId}/role`, token, {
    method: "PATCH",
    payload: { role },
  });
}
