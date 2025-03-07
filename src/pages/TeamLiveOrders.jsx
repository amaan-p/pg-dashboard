import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ViewOrderDetailsChild from '../components/ViewOrderDetailsChild';
import EditOrderDetailsChild from '../components/EditOrderDetailsChild';
import ConfirmOrder from '../components/ConfirmOrder';

const TeamOrdersLive = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Get team details from localStorage
    const getUserDetails = () => {
      try {
        const team = localStorage.getItem('team');
        const role = localStorage.getItem('role');

        const location= localStorage.getItem('location');

        if (team) {
          setTeamName(team || '');
          setRole(role || '');
          setLocation(location || '');
        } else {
          console.error("No user data found in localStorage");
        }
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    // Only fetch orders if we have a team name
    if (teamName) {
      fetchTeamOrders();
    }
  }, [teamName]);

  const fetchTeamOrders = async () => {
    setLoading(true);
    try {
      // Get all orders
      const ordersResponse = await axios.get("http://localhost:5000/api/orders");
      
      // Filter orders for the team
      const filteredOrders = ordersResponse.data.Orders.filter(order => {
        // Check if this team has any assigned items in the order
        const allItems = [
          ...(order.order_details.items || []),
          ...(order.order_details.caps || []),
          ...(order.order_details.boxes || []),
          ...(order.order_details.pumps || []),
          ...(order.order_details.decorations || [])
        ];
        
        // Filter by team name AND location if location is available
        return allItems.some(item => 
          item.team === teamName && 
          (location ? item.location === location : true)
        );
      });
      
      setOrders(filteredOrders);
    } catch (err) {
      console.error("Error fetching team orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditDetails = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleCompleteOrder = (order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const calculateTeamOrderStatus = (order) => {
    // Identify the team items in this order
    const teamItems = [];
    
    // Add location filter to team items
    const filterItem = (item) => 
      item.team === teamName && 
      (location ? item.location === location : true);
    
    // Check each type of item
    if (order.order_details.items) {
      teamItems.push(...order.order_details.items.filter(filterItem));
    }
    if (order.order_details.caps) {
      teamItems.push(...order.order_details.caps.filter(filterItem));
    }
    if (order.order_details.boxes) {
      teamItems.push(...order.order_details.boxes.filter(filterItem));
    }
    if (order.order_details.pumps) {
      teamItems.push(...order.order_details.pumps.filter(filterItem));
    }
    if (order.order_details.decorations) {
      teamItems.push(...order.order_details.decorations.filter(filterItem));
    }
    
    // Calculate team completion percentage
    if (teamItems.length === 0) return { progress: 0, completedItemsCount: 0, totalItemsCount: 0 };
    
    const completedItems = teamItems.filter(item => item.status === "Done");
    const progress = Math.round((completedItems.length / teamItems.length) * 100);
    
    return {
      progress,
      completedItemsCount: completedItems.length,
      totalItemsCount: teamItems.length
    };
  };

  // Check if we should display a role-specific message
  const getRoleMessage = () => {
    if (!role) return "";
    return `(${role})`;
  };

  // Check if we should display a location-specific message
  const getLocationMessage = () => {
    if (!location) return "";
    return ` at ${location}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome <span className="text-amber-500">{teamName}</span> {getRoleMessage()}{getLocationMessage()}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your team's assigned tasks and track order progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-white mb-2">Assigned Orders</h3>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-white mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-white">
              {orders.filter(order => {
                const status = calculateTeamOrderStatus(order);
                return status.progress > 0 && status.progress < 100;
              }).length}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-white mb-2">Completed</h3>
            <p className="text-3xl font-bold text-white">
              {orders.filter(order => {
                const status = calculateTeamOrderStatus(order);
                return status.progress === 100;
              }).length}
            </p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
            Your Team's Orders{location ? ` - ${location}` : ''}
          </h2>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4 mx-auto"></div>
              <p className="text-lg text-gray-600">Loading team orders...</p>
            </div>
          </div>
        ) : !teamName ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xl font-semibold text-gray-600">User information not found</p>
            <p className="text-gray-500 mt-2">Please log in again to view your team orders</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order, index) => {
              // Calculate team-specific stats for this order
              const teamStats = calculateTeamOrderStatus(order);
              
              // Create a modified order object with team-specific progress
              const teamOrder = {
                ...order,
                team_progress: teamStats.progress,
                team_stats: teamStats
              };
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 flex justify-between items-center">
                    <h2 className="text-white font-bold text-lg">Order #{order.order_number}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.order_status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                        order.order_status === "Processing" ? "bg-blue-100 text-blue-800" : 
                        "bg-green-100 text-green-800"
                      }`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Order Content */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Customer</p>
                        <p className="font-medium text-gray-800">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Order Date</p>
                        <p className="font-medium text-gray-800">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Team Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-700">Your Team's Progress</p>
                        <p className="text-sm text-gray-600">
                          {teamStats.completedItemsCount} of {teamStats.totalItemsCount} items
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            teamStats.progress < 30 ? "bg-red-500" : 
                            teamStats.progress < 70 ? "bg-amber-500" : 
                            "bg-green-500"
                          }`}
                          style={{ width: `${teamStats.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Team Items Section */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Your Team's Tasks</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {/* Display team-specific items */}
                        {[
                          ...(order.order_details.items || []),
                          ...(order.order_details.caps || []),
                          ...(order.order_details.boxes || []),
                          ...(order.order_details.pumps || []),
                          ...(order.order_details.decorations || [])
                        ]
                        .filter(item => item.team === teamName && (location ? item.location === location : true))
                        .map((item, idx) => {
                          // Determine item type and name
                          let itemType = "Item";
                          let itemName = "";
                          
                          if (item.typeof_items) {
                            itemType = "Item";
                            itemName = item.typeof_items;
                          } else if (item.cap_name) {
                            itemType = "Cap";
                            itemName = item.cap_name;
                          } else if (item.box_name) {
                            itemType = "Box";
                            itemName = item.box_name;
                          } else if (item.pump_name) {
                            itemType = "Pump";
                            itemName = item.pump_name;
                          } else if (item.decoration_name) {
                            itemType = "Decoration";
                            itemName = item.decoration_name;
                          }
                          
                          return (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  itemType === "Item" ? "bg-blue-500" :
                                  itemType === "Cap" ? "bg-purple-500" :
                                  itemType === "Box" ? "bg-amber-500" :
                                  itemType === "Pump" ? "bg-green-500" :
                                  "bg-red-500"
                                }`}></div>
                                <span className="text-sm">{itemType}: {itemName}</span>
                                <span className="ml-2 text-xs text-gray-500">({item.quantity})</span>
                              </div>
                              <div className={`px-2 py-1 text-xs rounded-full ${
                                item.status === "Done" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {item.status}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex p-4 space-x-2 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditDetails(order)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={() => handleCompleteOrder(order)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-semibold text-gray-600">No team orders found</p>
            <p className="text-gray-500 mt-2">Your team doesn't have any assigned tasks yet</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showViewModal && (
        <ViewOrderDetailsChild 
          order={selectedOrder} 
          onClose={() => setShowViewModal(false)} 
        />
      )}
      
      {showEditModal && (
        <EditOrderDetailsChild 
          order={selectedOrder} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
      
      {showConfirmModal && (
        <ConfirmOrder
          order={selectedOrder}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default TeamOrdersLive;