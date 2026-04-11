"use client";

import { useContext, useEffect, useState } from "react";

import { Blog } from "@/app/types/blog";
import { AppContext } from "@/contexts/AppProvider";
import { listPublishedBlogs } from "@/lib/blogs";
import AdCard from "./ads/AdCard";
import BlogCard from "./BlogCard";

export default function BlogFeed() {
  const { selectedTags } = useContext(AppContext);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      try {
        const response = await listPublishedBlogs();
        if (isActive) {
          setBlogs(response.items);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Unable to load blogs.");
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredBlogs =
    selectedTags.length === 0
      ? blogs
      : blogs.filter((blog) => selectedTags.some((tag) => blog.tags.includes(tag)));

  if (error) {
    return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  }

  if (!blogs.length) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-200">
        No published blogs yet. Once an admin approves submissions, they will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredBlogs.map((blog, index) => (
        <div key={blog.id}>
          <BlogCard blog={blog} />
          {(index + 1) % 4 === 0 ? <AdCard type="banner" /> : null}
        </div>
      ))}
    </div>
  );
}