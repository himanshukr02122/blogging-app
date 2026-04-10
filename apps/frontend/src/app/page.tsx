import BlogFeed from "@/components/blogs/BlogFeed";
import FilterSidebar from "@/components/blogs/filters/FilterSidebar";
import RightSidebar from "@/components/blogs/sidebar/RightSidebar";

export default function Home() {

  const arr = ["red", "black", "green"]
  console.log(arr);
  
  
  
  return (
    <section
      className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4"
    >
      {/* Mobile First: Single column */}
      <div className="flex flex-col gap-4">

        {/* Filters (top on mobile) */}
        <div className="lg:hidden">
          <FilterSidebar />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Blog Feed */}
          <div className="lg:col-span-6">
            <BlogFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
