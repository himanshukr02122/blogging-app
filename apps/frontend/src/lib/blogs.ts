import { apiRequest } from "@/lib/apiClient";
import { Blog } from "@/app/types/blog";

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

export async function listPublishedBlogs(): Promise<Blog[]> {
  const data = await apiRequest<{ items: Blog[] }>("/blogs");

  if (!data) return []; // handles 404 safely

  return data.items;
}

export function getPublishedBlog(blogId: number) {
  return apiRequest<Blog>(`/blogs/${blogId}`);
}

export function getBlogPreview(blogId: number) {
  return apiRequest<Blog>(`/blogs/${blogId}/preview`);
}

export function listMyBlogs() {
  return apiRequest<{ items: Blog[] }>("/blogs/mine");
}

export function createBlog(payload: BlogInput) {
  return apiRequest<Blog>("/blogs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitBlog(blogId: number) {
  return apiRequest<Blog>(`/blogs/${blogId}/submit`, {
    method: "POST",
  });
}

export function withdrawBlog(blogId: number) {
  return apiRequest<Blog>(`/blogs/${blogId}/withdraw`, {
    method: "POST",
  });
}

export function listReviewQueue(status = "pending_review") {
  return apiRequest<{ items: Blog[] }>(
    `/admin/blogs/submissions?status=${encodeURIComponent(status)}`
  );
}

export function reviewBlog(blogId: number, payload: ReviewInput) {
  return apiRequest<Blog>(`/admin/blogs/${blogId}/review`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}