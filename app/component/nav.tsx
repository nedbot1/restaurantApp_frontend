"use client";

import CreateTableModal from "@/app/component/createTable";
import FetchOrderModal from "@/app/component/fetchOrderModal";
import CreateMenuModal from "@/app/component/createMenus";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { id } = useParams();
  const [modalType, setModalType] = useState("fetchOrders"); // Default modal is "fetchOrders"

  const handleModalOpen = (type: string) => {
    setModalType(type);
  };

  const handleModalClose = () => {
    setModalType(""); // Close the modal
  };

  return (
    <div className="text-[#006C67] flex flex-col items-center">
      {/* Navbar Section */}
      <div className="my-9">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-6">
        {/* Orders Button */}
        <div
          className={modalType === "fetchOrders" ? "underline font-bold" : ""}
        >
          <button onClick={() => handleModalOpen("fetchOrders")}>Orders</button>
        </div>

        {/* Menu Button */}
        <div
          className={modalType === "createMenu" ? "underline font-bold" : ""}
        >
          <button onClick={() => handleModalOpen("createMenu")}>Menu</button>
        </div>

        {/* Tables Button */}
        <div
          className={modalType === "createTables" ? "underline font-bold" : ""}
        >
          <button onClick={() => handleModalOpen("createTables")}>
            Tables
          </button>
        </div>
      </div>

      {/* Modal Area */}
      {modalType && (
        <div className="fixed top-32 m-10 rounded-lg left-0 right-0 bottom-0 bg- bg-[#D9D9D9]/35 bg-opacity-90 z-50 flex">
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
