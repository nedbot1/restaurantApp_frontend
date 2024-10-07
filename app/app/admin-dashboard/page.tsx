"use client";
import Navbar from "@/app/component/nav";
import { useState, useEffect } from "react";
import { fetchUnpaidOrder } from "@/app/services/services";
import Modal from "@/app/component/modal";// Importing the Modal
import Button from "@/app/component/button";
import type { Order } from "@/app/type/type";

 export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For the selected order in modal

  const loadOrders = async () => {
    try {
      const { data } = await fetchUnpaidOrder();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const updateOrderStatus = (id: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, payed_at: new Date() } : order
      )
    );
  };

  // Open modal and set selected order
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
    <Navbar />
    </div>
  );
};
