"use client"

import { BlogContexts } from "@/contexts/AppProvider";
import { useContext } from "react";

const allTags = ["react", "javascript", "frontend", "css"];

export default function FilterSidebar() {

  const { selectedTags, setSelectedTags } = useContext(BlogContexts);
  
  const toggleTag = (tag: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm sticky top-22">
      <h2 className="font-semibold mb-3">Filters</h2>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Tags</p>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded text-xs border transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-100"
                  }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Stats</p>
        <ul className="text-xs text-gray-600 dark:text-gray-50 space-y-1">
          <li>Blogs read: 12</li>
          <li>Saved blogs: 5</li>
          <li>Top rated: 8</li>
        </ul>
      </div>
    </div>
  );
}