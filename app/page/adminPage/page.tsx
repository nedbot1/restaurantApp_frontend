"use client";
import { useState, useEffect } from "react";
import { fetchOrder } from "@/app/services/fetchRestaurant";
import EndSessionButton from "@/app/services/session";
import type { Order } from "@/app/type/restaurant_type";

const Page = ({ session_id }: { session_id: string }) => {
  const [order, setOrder] = useState <Order[]>([]);
  const loadOrder = async () => {
    try {
      const { data } = await fetchOrder();
      setOrder(data); // Ensure the data has the correct shape
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  useEffect(() => {
    loadOrder();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Order List</h1>
      <div className="grid gap-6">
        {order.map((item, index) => (
          <div
            key={index}
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
            {!item.payed_at && (
              <EndSessionButton
                session_id={item.session_id}
              />
            )}
            <div>{item.session_id} hello</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
