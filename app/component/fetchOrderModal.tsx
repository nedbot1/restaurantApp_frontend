"use client";
import { useState, useEffect } from "react";
import { fetchUnpaidOrder } from "@/app/services/services";
import { fetchOrder } from "../services/owner";
import Modal from "@/app/component/modal";// Importing the Modal
import Button from "@/app/component/button";
import type { Order } from "@/app/type/type";

 export default function FetchOrderModal(restaurantId:string) {
   const [orders, setOrders] = useState<Order[]>([]);
   const [isModalOpen, setIsModalOpen] = useState(false); // For modal state
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For the selected order in modal

   const loadOrders = async (restaurantId:string) => {
     try {
       const { data } = await fetchOrder(restaurantId);
       setOrders(data);
       console.log(data)
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
     loadOrders(restaurantId);
   }, []);

   return (
     <div className=" bg-gray-100 p-6">
       <h1 className="text-2xl font-semibold text-gray-700">Order</h1>
       <div className="grid gap-6">
         {orders.map(
           (order) =>
             !order.payed_at && (
               <div
                 key={order.id}
                 className="bg-white rounded-lg shadow p-6 border border-gray-200 flex"
               >
                 {/* Order Details */}
                 <div className="flex-1 border-2 mr-2 rounded-lg p-10 text">
                   <div className="text-gray-500 text-sm mb-2">
                     <strong>Ordered At:</strong>{" "}
                     {new Date(order.ordered_at).toLocaleString()}
                   </div>
                   <div className="text-gray-500 text-sm mb-2">
                     <strong>Status:</strong>{" "}
                     {order.payed_at ? (
                       <span className="text-green-500 font-semibold">
                         Paid on {new Date(order.payed_at).toLocaleString()}
                       </span>
                     ) : (
                       <span className="text-yellow-500 font-semibold">
                         Pending
                       </span>
                     )}
                   </div>
                   <div className="text-gray-700 text-lg font-semibold mb-8">
                     Table number: {order.table_number}
                   </div>
                   <div className="text-gray-700 text-lg font-semibold mb-8">
                     Total Amount: Nu {order.total_amount} /-
                   </div>

                   {/* Button to open modal */}
                   <button
                     className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                     onClick={() => openModal(order)} // Open modal with order details
                   >
                     Take Action
                   </button>
                 </div>

                 {/* Order List */}
                 <div className="flex-1">
                   <h3 className="text-gray-700 text-lg font-semibold mb-2">
                     Order List:
                   </h3>
                   {order.order_lists.map((list: any) => (
                     <div
                       key={list.id}
                       className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200"
                     >
                       <p className="text-gray-600">
                         Quantity: {list.quantity}
                       </p>
                       <p className="text-gray-600">
                         Total Price: Nu {list.total_price} /-
                       </p>
                       <p className="text-gray-600">
                         Item name: {list.item_name}
                       </p>
                     </div>
                   ))}
                 </div>
               </div>
             )
         )}
       </div>

       {/* Modal for button actions */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
         {selectedOrder && (
           <Button
             session_id={selectedOrder.session_id}
             isPaid={!!selectedOrder.payed_at}
             onStatusChange={() => updateOrderStatus(selectedOrder.id)}
             order_id={selectedOrder.id}
             onClose={closeModal}
           />
         )}
       </Modal>
     </div>
   );
 };
