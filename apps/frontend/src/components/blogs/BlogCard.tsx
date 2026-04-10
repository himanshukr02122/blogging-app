
import { Blog } from "@/app/types/blog";
import Image from "next/image";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition relative">
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={blog.author.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
          width={100}
          height={100}
        />
        <div>
          <p className="text-sm font-medium">{blog.author.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-50">
            {blog.author.headline}
          </p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">{blog.title}</h3>

      <p className="text-sm text-gray-600 dark:text-gray-100 line-clamp-3">
        {blog.summary}
      </p>

      {/* Hover CTA */}
      <button className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 text-white rounded-xl">
        View Blog
      </button>
    </div>
  );
}