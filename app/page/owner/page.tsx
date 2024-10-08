"use client"
import { useEffect, useState } from "react"
import { fetchOrder, fetchRestaurant } from "@/app/services/owner"
import { Order, Restaurant } from "@/app/type/type"

const OwnerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isFetchingOrders, setIsFetchingOrders] = useState(false)

  useEffect(() => {
    const accountID = localStorage.getItem('accountID');
    if (accountID) {
      const loadRestaurant = async () => {
        try {
          const response = await fetchRestaurant(accountID);
          setRestaurant(response); 
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Restaurant Information</h2>
      {restaurant ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <p className="text-xl font-semibold text-gray-700">Name: {restaurant.name}</p>
          <p className="text-sm text-gray-500">Location: {restaurant.location}</p>

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
        <p>Loading restaurant details...</p>
      )}

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
