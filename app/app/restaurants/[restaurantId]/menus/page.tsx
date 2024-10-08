"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { fetchMenu } from "@/app/services/services";
import type {
  Menu, 
  Session,
} from "@/app/type/type";

export default function Homepage({ params }: {params: {restaurantId: string}}) {
  const { restaurantId } = params
  // const searchParams = useSearchParams();
  // const table_id = searchParams.get("table_id");

  const [dishes, setDishes] = useState<Menu[]>([]);
 const [addTableForm, setAddTableForm] = useState(false);

  useEffect(() => {
    loadMenu();
  },[])

  // Fetch menu data
  const loadMenu = async () => {
    try {
      const data = await fetchMenu(restaurantId);
      setDishes(data.data);
    } catch (error) {
      console.error("error fetching menu", error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Menus
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
                  <p className="text-gray-500 mb-4">{dish.item_description}</p>
                  <p className="font-semibold text-lg text-blue-600">
                    Price: NU {dish.price}/-
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col pt-4 border-2 items-center gap-2">
        <button
          onClick={() => setAddTableForm(!addTableForm)}
          className="border-2 p-2 rounded-full hover:border-gray-300 hover:scale-105 transition duration-300 hover:bg-green-300 border-gray-300 flex flex-col items-center justify-center w-fit h-fit bg-green-100"
        >
          <svg
            className="w-24 h-24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <p className="text-center">Add more menus</p>
      </div>

      {addTableForm && (
        <div className="flex flex-col pt-4 items-center gap-2 border-2">
          <p className="text-center">Add menus</p>
          <input
            // onChange={(e) => setTableNumber(e.target.value)}
            type="text"
            placeholder="Item name"
            className="border-2 p-2 rounded-lg"
          />
          <input
            // onChange={(e) => setTableNumber(e.target.value)}
            type="text"
            placeholder="Item description"
            className="border-2 p-2 rounded-lg"
          />
          <input
            // onChange={(e) => setTableNumber(e.target.value)}
            type="text"
            placeholder="Item price"
            className="border-2 p-2 rounded-lg"
          />
          <input
            // onChange={(e) => setTableNumber(e.target.value)}
            type="text"
            placeholder="Item image"
            className="border-2 p-2 rounded-lg"
          />
          <button className="border-2 p-2 hover:border-gray-300 hover:scale-105 transition duration-300 hover:bg-green-300 border-gray-300">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
