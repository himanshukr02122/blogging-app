import Link from "next/link";

import { Blog } from "@/app/types/blog";

export default function BlogCard({ blog }: { blog: Blog }) {
  const initials = blog.author.username.slice(0, 2).toUpperCase();

  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="group relative block rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-800"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{blog.author.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">Published blog</p>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">{blog.title}</h3>
      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-100">{blog.summary}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {blog.tags.map((tag) => (
          <span
            key={`${blog.id}-${tag}`}
            className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}