"use client";
import { useState, useEffect } from "react";
import { fetchOrder } from "@/app/services/fetchRestaurant";
import EndSessionButton from "@/app/services/session";
import type { Order } from "@/app/type/restaurant_type";

const Page = ({ session_id }: { session_id: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const { data } = await fetchOrder();
      setOrders(data); // Ensure the data has the correct shape
      console.log(data)
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const updateOrderStatus = (id: string) => {
    setOrders((prevOrders: Order[]) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, payed_at: new Date() }
          : order
      )
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Order List</h1>
      <div className="grid gap-6">
        {orders.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="text-gray-500 text-sm mb-2">
              <strong>Ordered At:</strong>{" "}
              {new Date(item.ordered_at).toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm mb-2">
              <strong>Status:</strong>{" "}
              {item.payed_at ? (
                <span className="text-green-500 font-semibold">
                  Paid on {new Date(item.payed_at).toLocaleString()}
                </span>
              ) : (
                <span className="text-yellow-500 font-semibold">Pending</span>
              )}
            </div>
            <div className="text-gray-700 text-lg font-semibold mb-4">
              Total Amount: ${item.total_amount}
            </div>
            <div className="text-gray-700 text-lg font-semibold mb-4">
              ID: {item.id}
            </div>
            <EndSessionButton
              session_id={item.session_id}
              isPaid={!!item.payed_at}
              onStatusChange={(id:string)=>updateOrderStatus(id)}
              order_id = {item.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
