"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Blog } from "@/app/types/blog";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAppContext } from "@/contexts/AppProvider";
import { createBlog, listMyBlogs, submitBlog, withdrawBlog } from "@/lib/blogs";

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  tags: "",
};

export default function DashboardPage() {
  const { token, currentUser } = useAppContext();
  const [form, setForm] = useState(emptyForm);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdmin = currentUser?.role === "admin";

  const loadBlogs = useCallback(async () => {
    if (!token || isAdmin) return;
    setLoading(true);
    try {
      const response = await listMyBlogs(token);
      setBlogs(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your blogs.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBlogs();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadBlogs]);

  const tagPreview = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => ({ id: uuidv4(), value: tag })),
    [form.tags]
  );

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createBlog(token, {
        title: form.title,
        summary: form.summary,
        content: form.content,
        tags: tagPreview.map((tag) => tag.value),
      });
      setForm(emptyForm);
      setSuccess("Draft created. You can submit it for review from the list below.");
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create blog.");
    } finally {    
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (blogId: number) => {
    if (!token) return;
    setError("");
    setSuccess("");

    try {
      await submitBlog(token, blogId);
      setSuccess("Blog submitted for admin review.");
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit blog.");
    }
  };

  const handleWithdraw = async (blogId: number) => {
    if (!token) return;
    setError("");
    setSuccess("");

    try {
      await withdrawBlog(token, blogId);
      setSuccess("Blog submission withdrawn.");
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to withdraw blog.");
    }
  };

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h1 className="text-2xl font-semibold">
            {isAdmin ? "Admin Workspace" : "Author Dashboard"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {isAdmin
              ? "Review submitted blogs, approve or reject them with comments, and manage user roles."
              : "Create a draft, submit it for review, track the status, and read admin comments here."}
          </p>
        </div>

        {isAdmin ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/reviews"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold">Review Submitted Blogs</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Open the moderation queue to approve or reject pending submissions
                with comments.
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold">Manage User Roles</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                View all users and promote or demote accounts between author and
                admin.
              </p>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleCreate}
            className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <h2 className="mb-4 text-xl font-semibold">Create New Blog</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Blog title"
                className="rounded-lg border px-4 py-2"
                required
              />
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags, comma separated"
                className="rounded-lg border px-4 py-2"
              />
            </div>

            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Short summary"
              className="mt-4 min-h-24 w-full rounded-lg border px-4 py-2"
              required
            />

            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your blog content here"
              className="mt-4 min-h-40 w-full rounded-lg border px-4 py-2"
              required
            />

            {tagPreview.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {tagPreview.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                  >
                    #{tag.value}
                  </span>
                ))}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
          </form>
        )}

        {error ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : null}
        {success ? (
          <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700">{success}</p>
        ) : null}

        {!isAdmin ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Blogs</h2>

            {loading ? <p>Loading your blogs...</p> : null}

            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{blog.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {blog.summary}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase dark:bg-gray-700">
                    {blog.status.replaceAll("_", " ")}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                  {blog.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={`${blog.id}-${tag}`}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="rounded-lg border border-blue-200 px-4 py-2 text-sm text-blue-700 transition hover:bg-blue-50"
                  >
                    Preview
                  </Link>
                  {["draft", "rejected", "withdrawn"].includes(blog.status) ? (
                    <button
                      onClick={() => handleSubmitForReview(blog.id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                    >
                      Submit for review
                    </button>
                  ) : null}

                  {blog.status === "pending_review" ? (
                    <button
                      onClick={() => handleWithdraw(blog.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                    >
                      Withdraw submission
                    </button>
                  ) : null}
                </div>

                <div className="mt-6">
                  <h4 className="font-medium">Admin comments</h4>
                  {blog.review_comments.length ? (
                    <div className="mt-3 space-y-3">
                      {blog.review_comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">
                              {comment.admin.username}
                            </span>
                            <span className="text-xs uppercase text-gray-500">
                              {comment.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                            {comment.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      No admin comments yet.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </ProtectedRoute>
  );
}
