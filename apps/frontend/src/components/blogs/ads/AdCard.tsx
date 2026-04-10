export default function AdCard({ type }: { type: "banner" | "square" }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center text-sm text-gray-500 mt-4">
      Ad Space ({type})
    </div>
  );
}