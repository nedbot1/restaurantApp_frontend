"use client"
import { useEffect, useState } from "react"
import { fetchOrder } from "@/app/services/owner"
import { Order } from "@/app/type/type"
import { fetchRestaurant } from "@/app/services/owner"
import { Restaurant } from "@/app/type/type"
import Navbar from "@/app/component/nav"

const OwnerPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

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
          loadRestaurant(); // Call the function to fetch restaurant data
        }
      },[])

      useEffect(() => {
        const loadOrder = async () => {
          if (restaurant) { 
            try {
              const { data } = await fetchOrder(restaurant.id); 
              setOrders(data); 
            } catch (error) {
              console.log("Failed to fetch data", error);
            }
          }
        };
    
        loadOrder(); 
      }, [restaurant]);

    return (
      <div className="p-6">
        <Navbar/>
          <h2 className="text-2xl font-bold mb-6 text-center">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-700">Total Amount: ${order.total_amount}</p>
                  <p className="text-sm text-gray-500">Session ID: {order.session_id}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  {order.order_lists.map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-lg font-medium text-gray-800">{item.item_name}</p>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-semibold text-green-600">${item.total_price}</p>
                      <p className="text-lg font-semibold text-green-600">${item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
}
export default OwnerPage;
