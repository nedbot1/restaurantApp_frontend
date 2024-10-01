'use client'
import { useEffect, useState } from "react";
import Navbar from "@/app/component/nav";
import type { Restaurant } from "@/app/type/type";
import { fetchRestaurant, addRestaurant } from "@/app/services/services";
import Link from "next/link";

export default function RestaurantsPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContactNo] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>();
  const accountId = "c3d2d725-c96c-47f4-a615-0644c96bc81e"

  const newRestaurantData = {
    name: restaurantName,
    location: location,
    contact_number: contact,
    account_id: accountId
  }
  const handleAddRestaurantSubmit = async () => {
     await addRestaurant(newRestaurantData);
     await handlefetchRestaurant()
     alert("Restaurant added successfully");
  }
  const handlefetchRestaurant = async () => {
    const {data} = await fetchRestaurant();
    setRestaurants(data)
  }
  useEffect(() => {
    handlefetchRestaurant()
  },[])
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mt-6 text-center">Restaurants</h1>
        <div className="mx-auto bg-gray-300 p-4 rounded-lg w-fit shadow-md my-6">
          <h2>Add new restaurant</h2>
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Restaurant name"
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="location"
            />
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              value={contact}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder="contact no"
            />
            <input
              type="text"
              className="hidden"
              value={accountId}
            />
            <button onClick={handleAddRestaurantSubmit}>Add</button>
          </form>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants?.map((restaurant) => (
            <div key={restaurant.id} className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <Link href={`/app/restaurants/${restaurant.id}`}>
                <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
