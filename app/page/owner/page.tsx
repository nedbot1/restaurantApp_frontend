"use client";
import { useEffect, useState } from "react";
import {
  fetchOrder,
  fetchRestaurant,
  createRestaurant,
} from "@/app/services/owner";
import { Order, Restaurant } from "@/app/type/type";
import Navbar from "@/app/component/nav";
import Link from "next/link";

const OwnerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // To track if the account is premium
  const [isCreatingRestaurant, setIsCreatingRestaurant] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantContactNumber, setRestaurantContactNumber] = useState("");

  // Load restaurant data on component mount
  const loadRestaurant = async () => {
    const accountID = localStorage.getItem("accountID");
    console.log("acc id", accountID);
    if (accountID) {
      try {
        const response  = await fetchRestaurant(accountID);
        if (response) {
          setRestaurant(response);
          console.log(response,"my res")
        } else {
          setRestaurant(null); // No restaurant exists
        }
      } catch (error) {
        console.log("Failed to fetch restaurant data", error);
      }
    }
  };

  // Fetch restaurant data on initial mount
  useEffect(() => {
    loadRestaurant();
  }, []);


  // Handle restaurant creation
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountID = localStorage.getItem("accountID");
    if (accountID) {
      try {
        setIsCreatingRestaurant(true);
        const newRestaurant = await createRestaurant({
          name: restaurantName,
          location: restaurantLocation,
          contact_number: restaurantContactNumber,
          account_id: accountID,
        });
        setRestaurant(newRestaurant.data);
        // Call loadRestaurant to refresh the restaurant data after creation
        await loadRestaurant();
      } catch (error) {
        console.log("Failed to create restaurant", error);
      } finally {
        setIsCreatingRestaurant(false);
      }
    }
  };

  return (
    <div className="">
      <div className=" bg-[#D9D9D9]/35 rounded-3xl flex flex-col justify-center h-[47rem] px-14 gap-14 m-14">
        {restaurant && restaurant?.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Restaurants Information
            </h2>
            {restaurant?.map((rest) => (
              <Link
                key={rest.id}
                href={`/page/owner/${rest.id}`}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex mb-4"
              >
                <div className="flex flex-col">
                  <p className="text-xl font-semibold text-gray-700">
                    Name: {rest.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Location: {rest.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    Contact Number: {rest.contact_number}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-9">
            <img className=" h-16 mb-4" src="/logo.png" alt="Logo" />
            {/* Form to create a restaurant */}
            <form
              onSubmit={handleCreateRestaurant}
              className="mt-4 bg-white flex flex-col justify-center items-center w-fit p-10 rounded-xl border border-gray-300 shadow-md"
            >
              {/* Title */}
              <h2 className="text-2xl font-semibold text-black mb-6">
                Add new restaurant
              </h2>

              {/* Restaurant Name Input */}
              <input
                type="text"
                placeholder="Restaurant name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="border border-gray-300 bg-[#E3F2F2] p-3 rounded-lg w-80 mb-4"
                required
              />

              {/* Location Input */}
              <input
                type="text"
                placeholder="Location"
                value={restaurantLocation}
                onChange={(e) => setRestaurantLocation(e.target.value)}
                className="border border-gray-300 bg-[#E3F2F2] p-3 rounded-lg w-80 mb-4"
                required
              />

              {/* Contact Number Input */}
              <input
                type="text"
                placeholder="Contact number"
                value={restaurantContactNumber}
                onChange={(e) => setRestaurantContactNumber(e.target.value)}
                className="border border-gray-300 bg-[#E3F2F2] p-3 rounded-lg w-80 mb-6"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#006C67] hover:bg-[#005e5a] text-white text-lg font-semibold py-3 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
                disabled={isCreatingRestaurant}
              >
                {isCreatingRestaurant ? "Creating Restaurant..." : "Add +"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPage;
