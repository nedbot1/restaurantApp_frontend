"use client";

import { useState, useEffect } from "react";
import React from "react";
import { fetchMenu, fetchTable } from "@/app/services/fetchRestaurant";
import type {
  restaurant,
  menu,
  table,
  session,
} from "@/app/type/restaurant_type";

export default function Homepage() {
  const [tables, setTables] = useState<table[]>([]);
  const [dishes, setDishes] = useState<menu[]>([]);
  const [selectedTable, setSelectedTable] = useState<table | null>(null);
  const [cart, setCart] = useState<{
    [key: string]: { dish: menu; quantity: number; totalPrice: number };
  }>({});
  const [sessionToken, setSessionToken] = useState<session | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [SessionEndTime, setSessionEndTime] = useState<Date | null>(null); 


  // Fetch tables data
  const loadTable = async () => {
    try {
      const data = await fetchTable();
      setTables(data.data);
    } catch (error) {
      console.error("error fetching tables", error);
    }
  };

  // Fetch menu data
  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setDishes(data.data);
      // console.log(data, "my menu data");
    } catch (error) {
      console.error("error fetching menu", error);
    }
  };

  // Trigger fetching of tables and menus when the component mounts
  useEffect(() => {
    loadTable();
  }, []);

  useEffect(() => {
    // if (sessionToken) {
    //   console.log("session_token", sessionToken);
    // }
  }, [sessionToken]);

  // Handle table selection and load the menu for that table
  const handleTableClick = (table: table) => {
    setSelectedTable(table);
    // console.log("my table data", table);
    loadMenu(); // Simulate the user scanning the QR code and loading the menu
  };

  const startSession = async (tableId: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: { table_id: tableId } }),
      });
      const { data } = await response.json();
      setSessionToken(data);
      setSessionEndTime(new Date(data.end_time));// Save session token to track the session
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  // Add item to the cart or update quantity
  const handleAddToCart = (dish: menu) => {
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

  // Decrease item quantity in the cart
  const handleRemoveFromCart = (dish: menu) => {
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

  // Calculate total amount when cart is updated
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

  // Construct the order dynamically here
  const orderToSubmit = {
    session_id: sessionToken.id, // Use the session token from the backend
    total_amount: totalAmount,
    order_lists: Object.values(cart).map((item) => ({
      menu_item_id: item.dish.id,
      quantity: item.quantity,
      total_price: item.totalPrice,
    })),
  };

  console.log(orderToSubmit, "order being submitted");

  try {
    const response = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderToSubmit }), // Send the constructed order
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully!");
      // Optionally reset cart or navigate to another page
      setCart({});
      setTotalAmount(0);
    } else {
      console.error("Error placing order:", response.statusText);
      alert("error placing order.");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("An error occurred while placing your order.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!selectedTable && (
        <div className="flex flex-wrap justify-center mb-8">
          {tables.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                startSession(item.id);
                handleTableClick(item);
              }}
              className="bg-white rounded-lg shadow-lg p-6 m-4 w-full max-w-xs transform transition-transform hover:scale-105 hover:shadow-xl duration-300"
            >
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                {`Table ${item.table_number}`}
              </h1>
              <p className="text-xl text-gray-600">{`QR Code: ${item.qr_code}`}</p>
            </button>
          ))}
        </div>
      )}

      {selectedTable && (
        <div className="">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Menu for Table {selectedTable.table_number}
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-flex space-x-6 p-4">
              {dishes.map((dish, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl duration-300"
                  style={{ minWidth: "250px", minHeight: "300px" }}
                >
                  <img
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
              className="bg-blue-600 text-white py-3 px-6 rounded-xl mt-4 hover:bg-blue-700 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
