"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { fetchMenu } from "@/app/services/services";
import type { Menu, Session } from "@/app/type/type";
import { FaShoppingCart } from "react-icons/fa"; 
import { motion } from "framer-motion"; 

export default function Homepage({ params }) {
  const searchParams = useSearchParams();
  const table_id = searchParams.get("table_id");
  const restaurant_id = params.restaurantId;

  const [categories, setCategories] = useState<
    Array<{ category_name: string; menus: Menu[] }>
  >([]);

  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<{
    [key: string]: {
      dish: Menu;
      quantity: number;
      totalPrice: number;
    };
  }>({});
  const [sessionToken, setSessionToken] = useState<Session | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [sessionEndTime, setSessionEndTime] = useState<Date | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  useEffect(() => {
    if (table_id && restaurant_id) {
      handleQrScan(table_id, restaurant_id);
      // Fetch menu based on table_id
      fetchMenu(restaurant_id);
    } else {
      console.log("no table_id or restaurant_id found");
    }
  }, []);

  const loadMenu = async (restaurantId: string) => {
    try {
      const data = await fetchMenu(restaurantId);
      setCategories(data.data); // Assuming data.data contains the categories
      console.log(data, "my menus");
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  const handleQrScan = async (tableId: string, restaurantId: string) => {
    setSelectedTable(tableId);
    await startSession(tableId, restaurantId); // Await session start

    if (restaurantId) {
      await loadMenu(restaurantId); // Await menu load
    } else {
      console.error("Restaurant ID is not defined");
    }
  };

  const startSession = async (tableId: string, restaurantId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session: { table_id: tableId, restaurant_id: restaurantId },
          }),
        }
      );
      const { data } = await response.json();

      if (response.ok) {
        setSessionToken(data);
        setSessionEndTime(new Date(data.end_time));
        console.log(data);
      } else {
        console.error("Failed to start session:", data.message);
        alert("Error starting session.");
      }
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
    if (sessionEndTime && now > sessionEndTime) {
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
      restaurant_id,
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
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
          },
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
    <div className="min-h-screen relative">
      {selectedTable && (
        <div className="space-y-6">
          {/* Sticky Menus Header */}
          <h2 className="text-4xl font-bold text-gray-900 text-center sticky top-0 bg-white z-10 py-4 shadow-md">
            Menus
          </h2>

          {/* Categories and Dishes */}
          <div className="overflow-x-auto">
            {categories.map((category, catIndex) => (
              <div key={catIndex} className="mb-8">
                {/* Sticky category header */}
                <h3 className="text-3xl font-bold text-gray-700 mb-4 flex justify-center sticky py-2 shadow-sm">
                  {category.category_name}
                </h3>
                <div className="flex space-x-4 overflow-x-auto p-4">
                  {category.menus.map((dish, dishIndex) => (
                    <motion.div
                      key={dishIndex}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:shadow-xl duration-300"
                      style={{ minWidth: "200px", minHeight: "96px" }}
                      whileTap={{ scale: 0.9 }} // Animation on tap
                    >
                      <Image
                        className="w-full h-40 object-cover"
                        src={dish.dish_photo_link}
                        alt={dish.item_name}
                        width={220}
                        height={160}
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {dish.item_name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {dish.item_description}
                        </p>
                        <p className="font-semibold text-md text-blue-600">
                          Price: NU {dish.price}/-
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <button
                            className="bg-red-400 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                            onClick={() => handleRemoveFromCart(dish)}
                          >
                            -
                          </button>
                          <span className="text-md font-bold text-gray-700">
                            {cart[dish.id]?.quantity || 0}
                          </span>
                          <button
                            className="bg-green-400 text-white p-2 rounded-full hover:bg-green-500 transition-colors"
                            onClick={() => handleAddToCart(dish)}
                          >
                            +
                          </button>
                        </div>
                        <p className="mt-2 font-semibold text-md text-gray-700">
                          Total: NU {cart[dish.id]?.totalPrice || 0}/-
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Cart Icon */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={toggleCart}
              className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <FaShoppingCart size={24} />
              {Object.keys(cart).length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  {Object.keys(cart).length}
                </span>
              )}
            </button>
          </div>

          {/* Cart Summary Modal (Sliding Panel) */}
          {isCartOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 flex justify-end">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full sm:w-96 p-6 shadow-lg overflow-y-auto"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Cart Summary
                </h2>
                {Object.values(cart).length > 0 ? (
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {Object.values(cart).map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 rounded-lg mb-2 flex justify-between items-center shadow-sm"
                      >
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.dish.item_name} (x{item.quantity})
                        </h3>
                        <p className="text-gray-600 font-bold text-sm">
                          NU {item.totalPrice}/-
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-lg">Your cart is empty.</p>
                )}

                {/* Total and Place Order Button */}
                <div className="mt-2 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Total:</h3>
                  <p className="text-lg font-bold text-blue-600">
                    NU {totalAmount}/-
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Place Order
                  </button>
                </div>

                {/* Close Cart Button */}
                <button
                  onClick={toggleCart}
                  className="mt-4 w-full py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                >
                  Close Cart
                </button>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
