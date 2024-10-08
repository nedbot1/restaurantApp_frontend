"use client"
import { useEffect, useState } from "react"
import { fetchOrder, fetchRestaurant, createRestaurant } from "@/app/services/owner"
import { Order, Restaurant } from "@/app/type/type"

const OwnerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isFetchingOrders, setIsFetchingOrders] = useState(false)
  const [isPremium, setIsPremium] = useState(false); // To track if the account is premium
  const [isCreatingRestaurant, setIsCreatingRestaurant] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  const [restaurantContactNumber, setRestaurantContactNumber] = useState("");

  useEffect(() => {
    const accountID = localStorage.getItem('accountID');
    if (accountID) {
      const loadRestaurant = async () => {
        try {
          const response = await fetchRestaurant(accountID);
          if (response) {
            setRestaurant(response);
          } else {
            setRestaurant(null); // No restaurant exists
          }
          // Set isPremium to true or false based on account info (e.g., fetched from response)
          // setIsPremium(response.isPremium); // Uncomment and modify this based on API response
        } catch (error) {
          console.log("Failed to fetch restaurant data", error);
        }
      };
      loadRestaurant();
    }
  }, []);

  const handleFetchOrders = async () => {
    if (restaurant) {
      setIsFetchingOrders(true);
      try {
        const { data } = await fetchOrder(restaurant.id);
        console.log(data, "ordered data")
        setOrders(data);
      } catch (error) {
        console.log("Failed to fetch orders", error);
      } finally {
        setIsFetchingOrders(false);
      }
    }
  };

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh on form submission
    const accountID = localStorage.getItem('accountID');
    if (accountID) {
      try {
        setIsCreatingRestaurant(true);
        const newRestaurant = await createRestaurant({
          name: restaurantName,
          location: restaurantLocation,
          contact_number: restaurantContactNumber, 
          account_id: accountID,
        });
        setRestaurant(newRestaurant); // After creation, set the newly created restaurant
      } catch (error) {
        console.log("Failed to create restaurant", error);
      } finally {
        setIsCreatingRestaurant(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Restaurant Information</h2>

      {restaurant ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <p className="text-xl font-semibold text-gray-700">Name: {restaurant.name}</p>
          <p className="text-sm text-gray-500">Location: {restaurant.location}</p>
          <p className="text-sm text-gray-500">Contact Number: {restaurant.contact_number}</p>

          {/* Fetch Orders Button */}
          <button
            onClick={handleFetchOrders}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isFetchingOrders}
          >
            {isFetchingOrders ? "Fetching Orders..." : "Fetch Orders"}
          </button>
        </div>
      ) : (
        <div>
          <p>No restaurant found. You can create one:</p>

          {/* Form to create a restaurant */}
          <form onSubmit={handleCreateRestaurant} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Restaurant Name</label>
              <input
                type="text"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Location</label>
              <input
                type="text"
                placeholder="Restaurant Location"
                value={restaurantLocation}
                onChange={(e) => setRestaurantLocation(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Contact Number</label>
              <input
                type="text"
                placeholder="Contact Number"
                value={restaurantContactNumber}
                onChange={(e) => setRestaurantContactNumber(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isCreatingRestaurant}
            >
              {isCreatingRestaurant ? "Creating Restaurant..." : "Create Restaurant"}
            </button>
          </form>
        </div>
      )}

      {/* Display orders if there are any */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">Total Amount: ${order.total_amount}</p>
                  <p className="text-sm text-gray-500">Table Number: {order.table_number}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  {order.order_lists.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-lg font-medium text-gray-800">{item.item_name}</p>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-semibold text-green-600">Nu.{item.total_price}</p>
                      <p className="text-lg font-semibold text-green-600">Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerPage;
