"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { Blog } from "@/app/types/blog";
import { useAppContext } from "@/contexts/AppProvider";
import { getBlogPreview, getPublishedBlog } from "@/lib/blogs";

type BlogPageProps = {
  params: Promise<{
    blogId: string;
  }>;
};

export default function BlogPage({ params }: BlogPageProps) {
  const { blogId } = use(params);
  const { currentUser, isHydrated, token } = useAppContext();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    const numericBlogId = Number(blogId);
    if (!Number.isInteger(numericBlogId) || numericBlogId <= 0) {
      setError("Invalid blog link.");
      setLoading(false);
      return;
    }

    let isActive = true;

    const loadBlog = async () => {
      setLoading(true);
      setError("");

      try {
        const response = token
          ? await getBlogPreview(token, numericBlogId).catch(() => getPublishedBlog(numericBlogId))
          : await getPublishedBlog(numericBlogId);

        if (isActive) {
          setBlog(response);
        }
      } catch (err) {
        if (isActive) {
          setBlog(null);
          setError(err instanceof Error ? err.message : "Unable to load the blog.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadBlog();

    return () => {
      isActive = false;
    };
  }, [blogId, isHydrated, token]);

  if (loading || !isHydrated) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-300">Loading blog...</p>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="mx-auto max-w-4xl space-y-4 px-4 py-10">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Back to blogs
        </Link>
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <p className="text-sm text-red-600 dark:text-red-300">
            {error || "Blog not found."}
          </p>
        </div>
      </section>
    );
  }

  const isPreview = blog.status !== "approved";
  const canManageBlog =
    currentUser?.role === "admin" || currentUser?.id === blog.author.id;

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Back to blogs
        </Link>
        {canManageBlog ? (
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            Back to dashboard
          </Link>
        ) : null}
      </div>

      <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By {blog.author.username}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{blog.title}</h1>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              {blog.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isPreview ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase text-amber-800">
                Preview mode
              </span>
            ) : null}
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase dark:bg-gray-700">
              {blog.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={`${blog.id}-${tag}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="whitespace-pre-wrap text-base leading-8 text-gray-700 dark:text-gray-200">
            {blog.content}
          </div>
        </div>
      </article>
    </section>
  );
}
