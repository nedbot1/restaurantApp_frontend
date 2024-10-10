"use client";

import CreateTableModal from "@/app/component/createTable";
import FetchOrderModal from "@/app/component/fetchOrderModal";
import CreateMenuModal from "@/app/component/createMenus";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ManageRestaurant() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleModalOpen = (type: string) => {
    setModalOpen(true);
    setModalType(type);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalType(""); // Reset the modal type on close
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Manage Restaurant {id}</h1>
      <div className="flex flex-wrap justify-center mb-4">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4">
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalOpen("fetchOrders")}
          >
            Fetch Orders
          </button>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 p-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalOpen("createMenu")}
          >
            Create Menu
          </button>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 p-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleModalOpen("createTables")}
          >
            Create Tables
          </button>
        </div>
      </div>

      {/* Conditionally render modals based on the modalType */}
      {modalOpen && (
        <div className="bg-teal-400">
          {modalType === "fetchOrders" && (
            <FetchOrderModal onClose={handleModalClose} restaurantId={id} />
          )}
          {modalType === "createMenu" && (
            <CreateMenuModal onClose={handleModalClose} restaurantId={id} />
          )}
          {modalType === "createTables" && (
            <CreateTableModal onClose={handleModalClose} restaurantId={id} />
          )}
        </div>
      )}
    </div>
  );
}
