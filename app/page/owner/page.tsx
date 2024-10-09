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
    if (accountID) {
      try {
        const response = await fetchRestaurant(accountID);
        if (response) {
          setRestaurant(response);
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

  // Handle fetching orders
  const handleFetchOrders = async () => {
    if (restaurant) {
      setIsFetchingOrders(true);
      try {
        const { data } = await fetchOrder(restaurant.id);
        console.log(data, "ordered data");
        setOrders(data);
      } catch (error) {
        console.log("Failed to fetch orders", error);
      } finally {
        setIsFetchingOrders(false);
      }
    }
  };

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
        setRestaurant(newRestaurant);
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
      <div className=" bg-[#D9D9D9]/35 rounded-3xl flex flex-col justify-center px-14 gap-14 m-14 h-screen">
        {restaurant ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Restaurant Information
            </h2>
            <Link
              href={`/page/owner/${restaurant.id}`}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex"
            >
              <div className="flex flex-col">
                <p className="text-xl font-semibold text-gray-700">
                  Name: {restaurant.name}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {restaurant.location}
                </p>
                <p className="text-sm text-gray-500">
                  Contact Number: {restaurant.contact_number}
                </p>
              </div>

              {/* Fetch Orders Button */}
              {/* <button
            onClick={handleFetchOrders}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isFetchingOrders}
          >
            {isFetchingOrders ? "Fetching Orders..." : "Fetch Orders"}
          </button> */}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-9">
            <img
              className=" h-16 mb-4"
              src="/logo.png"
              alt="Logo"
            />
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

        {/* Display orders if there are any */}
        {/* {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">
                    Total Amount: ${order.total_amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    Table Number: {order.table_number}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  {order.order_lists.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-lg font-medium text-gray-800">
                        {item.item_name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Nu.{item.total_price}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
};

export default OwnerPage;
