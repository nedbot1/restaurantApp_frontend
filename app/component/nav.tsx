import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/app/admin-dashboard">
              <p className="text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </p>
            </Link>
            <Link href="/app/restaurants">
              <p className="text-white px-3 py-2 rounded-md text-sm font-medium">
                Restaurants
              </p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
