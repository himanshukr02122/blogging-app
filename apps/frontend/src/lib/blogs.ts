import { Blog } from "@/app/types/blog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type BlogInput = {
  title: string;
  summary: string;
  content: string;
  tags: string[];
};

type ReviewInput = {
  status: "approved" | "rejected";
  comment: string;
};

async function request<T>(
  path: string,
  token?: string | null,
  options?: { method?: string; payload?: unknown }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    headers,
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

export function listPublishedBlogs() {
  return request<{ items: Blog[] }>("/blogs");
}

export function getPublishedBlog(blogId: number) {
  return request<Blog>(`/blogs/${blogId}`);
}

export function getBlogPreview(token: string, blogId: number) {
  return request<Blog>(`/blogs/${blogId}/preview`, token);
}

export function listMyBlogs(token: string) {
  return request<{ items: Blog[] }>("/blogs/mine", token);
}

export function createBlog(token: string, payload: BlogInput) {
  return request<Blog>("/blogs", token, { method: "POST", payload });
}

export function submitBlog(token: string, blogId: number) {
  return request<Blog>(`/blogs/${blogId}/submit`, token, { method: "POST" });
}

export function withdrawBlog(token: string, blogId: number) {
  return request<Blog>(`/blogs/${blogId}/withdraw`, token, { method: "POST" });
}

export function listReviewQueue(token: string, status = "pending_review") {
  return request<{ items: Blog[] }>(
    `/admin/blogs/submissions?status=${encodeURIComponent(status)}`,
    token
  );
}

export function reviewBlog(token: string, blogId: number, payload: ReviewInput) {
  return request<Blog>(`/admin/blogs/${blogId}/review`, token, {
    method: "POST",
    payload,
  });
}
