"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { fetchMenu, } from "@/app/services/services";
import type {
  Restaurant,
  Menu,
  Table,
  Session,
} from "@/app/type/type";

export default function Homepage() {
  const searchParams = useSearchParams();
  const table_id = searchParams.get("table_id");
  const restaurant_id = searchParams.get("restaurant_id")
  const [dishes, setDishes] = useState<Menu[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<{
    [key: string]: { dish: Menu; quantity: number; totalPrice: number; restaurant_id:string};
  }>({});
  const [sessionToken, setSessionToken] = useState<Session | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [SessionEndTime, setSessionEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (table_id && restaurant_id) {
      handleQrScan(table_id);
       // Fetch menu based on table_id
      fetchMenu(restaurant_id);    }
  }, [table_id]);

  
  const loadMenu = async (restaurantId: string) => {     // Fetch menu data
    try {
      const data = await fetchMenu(restaurantId);
      setDishes(data.data);
      console.log(data, "my menu data");
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  const handleQrScan = (tableId: string) => {
    setSelectedTable(tableId);
    startSession(tableId);

    if (restaurant_id) {
      loadMenu(restaurant_id);
    } else {
      console.error("Restaurant ID is not defined");
    }
  };

  const startSession = async (tableId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session: { table_id: tableId } }),
        }
      );
      const { data } = await response.json();
      setSessionToken(data);
      setSessionEndTime(new Date(data.end_time));
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleAddToCart = (dish: Menu) => {
    setCart((prevCart) => {
      const existingItem = prevCart[dish.id];
      const updatedQuantity = existingItem ? existingItem.quantity + 1 : 1;
      const updatedTotalPrice = updatedQuantity * dish.price;
      return {
        ...prevCart,
        [dish.id]: {
          dish,
          quantity: updatedQuantity,
          totalPrice: updatedTotalPrice,
        },
      };
    });
  };

  const handleRemoveFromCart = (dish: Menu) => {
    setCart((prevCart) => {
      const existingItem = prevCart[dish.id];
      if (!existingItem || existingItem.quantity <= 1) {
        const { [dish.id]: _, ...rest } = prevCart;
        return rest;
      }

      const updatedQuantity = existingItem.quantity - 1;
      const updatedTotalPrice = updatedQuantity * dish.price;

      return {
        ...prevCart,
        [dish.id]: {
          dish,
          quantity: updatedQuantity,
          totalPrice: updatedTotalPrice,
        },
      };
    });
  };

  useEffect(() => {
    const newTotalAmount = Object.values(cart).reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    setTotalAmount(newTotalAmount);
  }, [cart]);

  const handleSubmitOrder = async () => {
    if (!sessionToken) {
      alert("No session started. Please select a table.");
      return;
    }

    const now = new Date();
    if (SessionEndTime && now > SessionEndTime) {
      alert("Session has expired. You cannot place an order.");
      return;
    }

    if (totalAmount === 0) {
      alert("Cannot place empty order");
      return;
    }

    const orderToSubmit = {
      session_id: sessionToken.id,
      total_amount: totalAmount,
      restaurant_id: cart.restaurant_id,
      order_lists: Object.values(cart).map((item) => ({
        menu_item_id: item.dish.id,
        quantity: item.quantity,
        total_price: item.totalPrice,
      })),
    };

    console.log(orderToSubmit, "order being submitted");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: orderToSubmit }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        setCart({});
        setTotalAmount(0);
      } else {
        console.error("Error placing order:", response.statusText);
        alert("Error placing order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {selectedTable && (
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Menu for Table
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-flex space-x-6 p-4">
              {dishes.map((dish, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300"
                  style={{ minWidth: "250px", minHeight: "300px" }}
                >
                  <Image
                    className="w-full h-56 object-cover"
                    src={dish.dish_photo_link}
                    alt={dish.item_name}
                  />
                  <div className="p-5">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {dish.item_name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {dish.item_description}
                    </p>
                    <p className="font-semibold text-lg text-blue-600">
                      Price: NU {dish.price}/-
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        className="bg-red-400 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                        onClick={() => handleRemoveFromCart(dish)}
                      >
                        -
                      </button>
                      <span className="text-xl font-bold text-gray-700">
                        {cart[dish.id]?.quantity || 0}
                      </span>
                      <button
                        className="bg-green-400 text-white p-2 rounded-full hover:bg-green-500 transition-colors"
                        onClick={() => handleAddToCart(dish)}
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-4 font-semibold text-lg text-gray-700">
                      Total Price: NU {cart[dish.id]?.totalPrice || 0}/-
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-12 bg-gray-50 p-8 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Cart Summary
            </h2>
            {Object.values(cart).length > 0 ? (
              Object.values(cart).map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg mb-4 flex justify-between items-center shadow-sm"
                >
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.dish.item_name}
                  </h3>
                  <p className="text-lg text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="font-semibold text-lg text-blue-600">
                    Total Price: NU {item.totalPrice}/-
                  </p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-600">Your cart is empty.</p>
            )}
            <div className="mt-6 text-2xl font-bold text-gray-800">
              Total Amount: NU {totalAmount}/-
            </div>
            <button
              onClick={handleSubmitOrder}
              className="mt-6 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
