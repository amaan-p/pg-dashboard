import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmOrder from '../components/ConfirmOrder';
import ViewDispatcherOrderDetails from '../components/ViewDispatcherOrderDetails';

export const LiveOrders = ({ allorders, loading: parentLoading, onCompleteOrder }) => {
  const [completeOrder, setCompleteOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    if (allorders && allorders.length > 0) {
      setOrders(allorders);
      setLoading(false);
    }
  }, [allorders]);

  useEffect(() => {
    // Set loading state based on parent's loading state if provided
    if (parentLoading !== undefined) {
      setLoading(parentLoading);
    }

    
    const fetchOrderData = async () => {
      if (!allorders || allorders.length === 0) {
        setLoading(true);
        try {
          const response = await axios.get("http://localhost:5000/api/orders");
          setOrders(response.data.Orders || []);
        } catch (err) {
          console.log(err);

          setOrders([]);
        } finally {
          setLoading(false);
        }
      }
    };

  
    fetchOrderData();
  }, [allorders, parentLoading]);

 
  const handleCompleteOrder = (order) => {
    if (onCompleteOrder) {
      onCompleteOrder(order);
    } else {
      setSelectedOrder(order);
      setCompleteOrder(true);
    }
  };

  const toggleOrderExpand = (orderNumber) => {
    if (expandedOrder === orderNumber) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderNumber);
    }
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const calculateCompletion = (order) => {
    const allItems = [
      ...(order.order_details.items || []),
      ...(order.order_details.caps || []),
      ...(order.order_details.boxes || []),
      ...(order.order_details.pumps || []),
      ...(order.order_details.decorations || [])
    ];

    if (allItems.length === 0) return 0;

    const completedItems = allItems.filter(item => item.status === "Done").length;
    return Math.round((completedItems / allItems.length) * 100);
  };

  const handleClose = () => {
    setShowOrderDetails(false)
  }



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-6">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-lg text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : orders && orders.length > 0 ? (
          orders.map((order, index) => {
            const completionPercentage = calculateCompletion(order);
            const isExpanded = expandedOrder === order.order_number;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg w-full lg:w-[calc(50%-12px)]"
                style={{ height: 'fit-content' }} // Force height to be based on content only
              >
                <div
                  className="border-l-4 border-amber-500 px-4 py-3 bg-amber-50 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleOrderExpand(order.order_number)}
                >
                  <h2 className="text-lg font-bold text-gray-800">Order #{order.order_number}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.order_status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      order.order_status === "Processing" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                      {order.order_status}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Always visible order summary */}
                <div className="p-4 border-b border-gray-200">
                  {/* Replace grid with flex layout for the summary info */}
                  <div className="flex flex-wrap">
                    <div className="w-1/2 md:w-1/4 p-1">
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                    </div>
                    <div className="w-1/2 md:w-1/4 p-1">
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="w-1/2 md:w-1/4 p-1">
                      <p className="text-sm text-gray-500">Dispatcher</p>
                      <p className="font-medium text-gray-800">{order.dispatcher_name}</p>
                    </div>
                    <div className="w-1/2 md:w-1/4 p-1">
                      <p className="text-sm text-gray-500">Completion</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-amber-500 h-2.5 rounded-full"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</p>
                    </div>
                  </div>
                </div>

                {/* Expandable order details */}
                {isExpanded && (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">Item Status</h3>
                    <div className="overflow-y-auto max-h-64 pr-2 space-y-2 pt-2">
                      {/* Display Item Status */}
                      {order.order_details.items && order.order_details.items.map((item, idx) => (
                        <div key={`item-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                            <span className="font-medium text-gray-700">{item.team}: {item.typeof_items}</span>
                            <span className="ml-2 text-sm text-gray-500">({item.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}

                      {/* Display Cap Status */}
                      {order.order_details.caps && order.order_details.caps.map((cap, idx) => (
                        <div key={`cap-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                            <span className="font-medium text-gray-700">{cap.team}: {cap.cap_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({cap.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${cap.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {cap.status}
                          </span>
                        </div>
                      ))}

                      {/* Display Box Status */}
                      {order.order_details.boxes && order.order_details.boxes.map((box, idx) => (
                        <div key={`box-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-amber-500"></div>
                            <span className="font-medium text-gray-700">{box.team}: {box.box_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({box.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${box.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {box.status}
                          </span>
                        </div>
                      ))}

                      {/* Display Pump Status */}
                      {order.order_details.pumps && order.order_details.pumps.map((pump, idx) => (
                        <div key={`pump-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                            <span className="font-medium text-gray-700">{pump.team}: {pump.pump_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({pump.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${pump.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {pump.status}
                          </span>
                        </div>
                      ))}

                      {/* Display Decoration Status */}
                      {order.order_details.decorations && order.order_details.decorations.map((deco, idx) => (
                        <div key={`deco-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full mr-2 bg-red-500"></div>
                            <span className="font-medium text-gray-700">{deco.team}: {deco.decoration_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({deco.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${deco.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {deco.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex p-4 space-x-2 justify-between">
                  <button
                    onClick={() => {
                      setSelectedOrder(order); // Add this line
                      setShowOrderDetails(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteOrder(order);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200"
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 flex items-center justify-center w-full">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl font-semibold text-gray-600">No orders found</p>
              <p className="text-gray-500 mt-2">Create your first order to get started</p>
            </div>
          </div>
        )}
      </div>

      {!onCompleteOrder && completeOrder && (
        <ConfirmOrder onClose={() => setCompleteOrder(false)} order={selectedOrder} />
      )}
      {showOrderDetails && <ViewDispatcherOrderDetails orders={selectedOrder} onClose={handleClose} />}
    </div>
  );
};

export default LiveOrders; 