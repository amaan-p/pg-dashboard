import React from "react";
import { Eye, Edit, Check } from "lucide-react";
import { useState } from "react";
import EditOrderDetailsChild from '../components/EditOrderDetailsChild';
import ViewOrderDetailsChild from "../components/ViewUserOrderDetails";

const orders = [
  {
    id: 1,
    customerName: "A",
    dispatcherName: "D",
    items: [
      { name: "Item A", qty: 1000, stock: 0 },
      { name: "Item B", qty: 1000, stock: 0 },
    ],
  },
  {
    id: 2,
    customerName: "B",
    dispatcherName: "E",
    items: [
      { name: "Item C", qty: 500, stock: 10 },
      { name: "Item D", qty: 800, stock: 5 },
    ],
  },
  {
    id: 3,
    customerName: "C",
    dispatcherName: "F",
    items: [
      { name: "Item E", qty: 300, stock: 0 },
      { name: "Item F", qty: 600, stock: 2 },
    ],
  },
];

const TeamLiveOrders2 = () => {
  const [editModalDetails, setEditModalDetails] = useState(false)
  const [viewDetails, setViewDetails] = useState(false)

  const handleModalClose = () => {
    setEditModalDetails(false)
    setViewDetails(false)
  }
  return (
    <div className="w-full space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-lg border border-orange-300 rounded-lg p-4 w-full">
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            {/* Left Section */}
            <div className="w-full md:w-1/2">
              <p className="text-sm font-semibold">Customer Name: {order.customerName}</p>
              <p className="text-sm font-semibold">Dispatcher Name: {order.dispatcherName}</p>
            </div>

            <div className="w-full md:w-1/2 border-l border-orange-300 pl-4 overflow-y-auto max-h-40">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm mb-1">
                  <p className="font-semibold">Item Name: {item.name}</p>
                  <p>QTY: {item.qty}</p>
                  <p>Stock: {item.stock}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Buttons - Two on the left, one on the right */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button onClick={() => setViewDetails(true)} className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 text-sm">
                <Eye size={14} /> View Details
              </button>
              <button onClick={() => setEditModalDetails(true)} className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded shadow hover:bg-gray-600 text-sm">
                <Edit size={14} /> Edit Details
              </button>
            </div>

            <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 text-sm">
              <Check size={14} /> Complete Order
            </button>
          </div>
        </div>
      ))}
      {editModalDetails && <EditOrderDetailsChild onClose={handleModalClose} />}
      {viewDetails && <ViewOrderDetailsChild onClose={handleModalClose} />}
    </div>
  );
};

export default TeamLiveOrders2;
