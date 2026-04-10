"use client"

import { blogs } from "@/data/dummyBlogs";
import { Blog } from "@/app/types/blog";
import BlogCard from "./BlogCard";
import AdCard from "./ads/AdCard";
import { BlogContexts } from "@/contexts/AppProvider";
import { useContext } from "react";

export default function BlogFeed() {

  const { selectedTags } = useContext(BlogContexts);

  const filteredBlogs =
    selectedTags.length === 0
      ? blogs
      : blogs.filter((blog: Blog) =>
          selectedTags.some((tag) => blog.tags.includes(tag))
        );

  return (
    <div className="space-y-4">
      {filteredBlogs.map((blog: Blog, index: number) => (
        <div key={blog.id}>
          <BlogCard blog={blog} />
          {(index + 1) % 4 === 0 && <AdCard type="banner" />}
        </div>
      ))}
    </div>
  );
}