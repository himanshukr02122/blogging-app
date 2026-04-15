"use client";

import { useCallback, useEffect, useState } from "react";

import { Blog } from "@/app/types/blog";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAppContext } from "@/contexts/AppProvider";
import { listReviewQueue, reviewBlog } from "@/lib/blogs";

export default function AdminReviewsPage() {
  const { token } = useAppContext();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQueue = useCallback(async () => {
    if (!token) return;

    try {
      const response = await listReviewQueue(token);
      setBlogs(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load review queue.");
    }
  }, [token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadQueue();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadQueue]);

  const handleReview = async (blogId: number, status: "approved" | "rejected") => {
    if (!token) return;
    const comment = comments[blogId]?.trim();

    if (!comment) {
      setError("Please add a review comment before approving or rejecting.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await reviewBlog(token, blogId, { status, comment });
      setComments((prev) => ({ ...prev, [blogId]: "" }));
      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to review blog.");
    } finally {    
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h1 className="text-2xl font-semibold">Admin Review Queue</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Review submitted blogs, leave comments, and approve or reject each
            submission.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : null}

        {blogs.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            No blogs are waiting for review right now.
          </div>
        ) : null}

        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Submitted by {blog.author.username}
                </p>
              </div>
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-800">
                {blog.status.replaceAll("_", " ")}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-700 dark:text-gray-200">{blog.summary}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
              {blog.content}
            </p>

            <textarea
              value={comments[blog.id] ?? ""}
              onChange={(e) =>
                setComments((prev) => ({ ...prev, [blog.id]: e.target.value }))
              }
              placeholder="Write admin review comments"
              className="mt-4 min-h-28 w-full rounded-lg border px-4 py-2"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleReview(blog.id, "approved")}
                className="rounded-lg bg-green-600 px-4 py-2 text-white"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Approve"}
              </button>
              <button
                onClick={() => handleReview(blog.id, "rejected")}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Reject"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </ProtectedRoute>
  );
}
