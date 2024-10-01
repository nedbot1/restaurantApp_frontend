"use client";
import Link from "next/link";
import Navbar from "@/app/component/nav";
export default function RestaurantPage({params}: {params: {restaurantId: string}}) {
  const {restaurantId} = params
  return (
    <div>
      <Navbar /> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Link href={`/app/restaurants/${restaurantId}/orders`}>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">Orders</h2>
          </div>
        </Link>
        <Link href={`/app/restaurants/${restaurantId}/menus`}>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">Menus</h2>
          </div>
        </Link>
        <Link href={`/app/restaurants/${restaurantId}/tables`}>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:bg-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">Tables</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}