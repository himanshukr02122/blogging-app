import AdCard from "../ads/AdCard";

const RightSidebar = async () => {

  
  // const response = await fetch('https://jsonplaceholder.typicode.com/todos')
  // const todoLists = await response.json()

  // console.log(todoLists, "todoLists---");
  
  return (
    <div className="space-y-4 sticky top-22">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">Trending</h3>
        <ul className="text-sm space-y-1">
          <li>🔥 React Performance Tips</li>
          <li>🔥 Next.js 15 Features</li>
          <li>🔥 Tailwind Tricks</li>
        </ul>
      </div>

      <AdCard type="square" />

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {["react", "nextjs", "ts"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-500 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;