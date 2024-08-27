"use client";

import { useState, useEffect } from "react";
import React from "react";
import { fetchMenu, fetchTable } from "@/app/services/fetchRestaurant";
import type { restaurant, menu, table, session } from "@/app/type/restaurant_type";

export default function Homepage() {
  const [tables, setTables] = useState<table[]>([]);
  const [dishes, setDishes] = useState<menu[]>([]);
  const [selectedTable, setSelectedTable] = useState<table | null>(null);
  const [cart, setCart] = useState<menu[]>([]);
  const [sessionToken, setSessionToken] = useState<session | null>(null);

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
       console.log(data, "my menu data");
    } catch (error) {
      console.error("error fetching menu", error);
    }
  };

  // Trigger fetching of tables and menus when the component mounts
  useEffect(() => {
    loadTable();
  }, []);

  // Handle table selection and load the menu for that table
  const handleTableClick = (table: table) => {
    setSelectedTable(table);
     console.log("my table data", table)
    loadMenu(); // Simulate the user scanning the QR code and loading the menu
  };

  const startSession = async (tableId:string) => {
    try {
      const response = await fetch("http://localhost:4000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: { table_id: tableId } }),
      });
      const data = await response.json();
      setSessionToken(data.session_token);// Save session token to track the session
      console.log(data, "session token");
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  return (
    <div>
      {/* If no table is selected, show the table buttons */}
      {!selectedTable && (
        <div className="flex flex-wrap justify-center mb-4">
          {tables.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                startSession(item.id)
                handleTableClick(item)
              }}
              className="bg-white rounded shadow-md p-4 m-4 w-64"
            >
              <h1 className="text-2xl font-bold">{`Table ${item.table_number}`}</h1>
              <h1 className="text-2xl font-bold">{`QR Code: ${item.qr_code}`}</h1>
            </button>
          ))}
        </div>
      )}

      {/* If a table is selected, show the menu */}
      {selectedTable && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Menu for Table {selectedTable.table_number}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish, index) => (
              <div key={index} className="bg-white rounded shadow-md p-4">
                <img
                  src={dish.dish_photo_link}
                />
                <h3 className="text-xl font-bold">{dish.item_name}</h3>
                <p>{dish.item_description}</p>
                <p className="font-semibold">Price: ${dish.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
