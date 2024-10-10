import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-transparent">
      <div className="">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
        <Link href="/app/admin-dashboard">
          <p className="text-white px-3 py-2 rounded-md text-sm font-medium">
            Home
          </p>
        </Link>
        <Link href="/page/owner">
          <p className="text-white px-3 py-2 rounded-md text-sm font-medium">
            Restaurants
          </p>
        </Link>
      </div>
    </nav>
  );
}
