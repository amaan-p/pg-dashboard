import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
const CreateOrderModal = ({ onClose }) => {
  // Basic order information
  const [orderNumber, setOrderNumber] = useState("");
  const [dispatcherName, setDispatcherName] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Teams data for dropdowns
  const [availableTeams, setAvailableTeams] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Order details with nested arrays for each category
  const [orderDetails, setOrderDetails] = useState({
    items: [{ typeof_items: "", quantity: "", weight: "", team: "Glass Manufacturing - Mumbai", status: "Pending" }],
    caps: [{ cap_name: "", quantity: "", cap_type: "", team: "Cap Manufacturing Team", status: "Pending" }],
    boxes: [{ box_name: "", quantity: "", box_finish: "", team: "Packaging Team", status: "Pending" }],
    pumps: [{ pump_name: "", quantity: "", team: "Pump Manufacturing Team", status: "Pending" }],
    decorations: [{ decoration_name: "", quantity: "", link: "", team: "Decoration Team", status: "Pending" }]
  });

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch teams and other dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teams
        const teamsResponse = await axios.get("https://pg-dash-backend.vercel.app/api/allusers");
        const teams = teamsResponse.data.users
          .filter(user => user.team && user.location)
          .map(user => `${user.team}-${user.location}`);

        // Get unique team names
        setAvailableTeams([...new Set(teams)]);

        // For demo purposes, create sample dispatchers and customers
        // In a real app, these would come from your API
        setDispatchers(["abc", "def", "ghi", "jkl"]);
        setCustomers(["xyz", "uvw", "rst", "opq"]);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };

    fetchData();
  }, []);

  // Generic handler for updating nested fields in orderDetails
  const handleDetailChange = (category, index, field, value) => {
    const updatedDetails = { ...orderDetails };
    updatedDetails[category][index][field] = value;
    setOrderDetails(updatedDetails);
  };

  // Add a new item to a specific category
  const addItem = (category) => {
    const updatedDetails = { ...orderDetails };

    // Create a new item based on the category
    let newItem = { team: "", status: "Pending" };

    switch (category) {
      case 'items':
        newItem = { typeof_items: "", quantity: "", weight: "", team: "Glass Manufacturing Team", status: "Pending" };
        break;
      case 'caps':
        newItem = { cap_name: "", quantity: "", cap_type: "", team: "Cap Manufacturing Team", status: "Pending" };
        break;
      case 'boxes':
        newItem = { box_name: "", quantity: "", box_finish: "", team: "Packaging Team", status: "Pending" };
        break;
      case 'pumps':
        newItem = { pump_name: "", quantity: "", team: "Pump Manufacturing Team", status: "Pending" };
        break;
      case 'decorations':
        newItem = { decoration_name: "", quantity: "", link: "", team: "Decoration Team", status: "Pending" };
        break;
      default:
        break;
    }

    updatedDetails[category].push(newItem);
    setOrderDetails(updatedDetails);
  };

  // Remove an item from a specific category
  const removeItem = (category, index) => {
    if (orderDetails[category].length === 1) return; // Keep at least one item

    const updatedDetails = { ...orderDetails };
    updatedDetails[category].splice(index, 1);
    setOrderDetails(updatedDetails);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the new order object
      const newOrder = {
        order_number: orderNumber,
        dispatcher_name: dispatcherName,
        customer_name: customerName,
        created_at: new Date().toLocaleDateString(),
        order_status: "Pending",
        order_details: orderDetails
      };

      // Send the order to your API endpoint
      const response = await axios.post("http://localhost:5000/api/orders/create", newOrder);

      // Append the new order to the Orders array (assuming it's imported)
      // Note: In a real app, you'd probably use a state management solution like Redux
      // This is a simplification for demo purposes
      if (typeof window !== 'undefined') {
        // This is client-side code
        if (window.Orders) {
          window.Orders.push(newOrder);
        }
      }

      // Show success and close modal
      alert("Order created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">

      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in z-50"
      >

        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispatcher Name
                  </label>
                  <select
                    value={dispatcherName}
                    onChange={(e) => setDispatcherName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Dispatcher</option>
                    {dispatchers.map((dispatcher, idx) => (
                      <option key={idx} value={dispatcher}>
                        {dispatcher}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <select
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer, idx) => (
                      <option key={idx} value={customer}>
                        {customer}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-6 border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                  <button
                    type="button"
                    onClick={() => addItem('items')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Item
                  </button>
                </div>

                {orderDetails.items.map((item, index) => (
                  <div key={`item-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-2 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={item.typeof_items}
                        onChange={(e) => handleDetailChange('items', index, 'typeof_items', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleDetailChange('items', index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
                      <input
                        type="text"
                        value={item.weight}
                        onChange={(e) => handleDetailChange('items', index, 'weight', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                      <select
                        value={item.team}
                        onChange={(e) => handleDetailChange('items', index, 'team', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      >
                        <option value="Glass Manufacturing Team">Glass Manufacturing Team</option>
                        {availableTeams.map((team, idx) => (
                          <option key={idx} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem('items', index)}
                        className="flex items-center text-red-600 hover:text-red-800 mt-5"
                      >
                        <Minus size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Caps Section */}
              <div className="mb-6 border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Caps</h3>
                  <button
                    type="button"
                    onClick={() => addItem('caps')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Cap
                  </button>
                </div>

                {orderDetails.caps.map((cap, index) => (
                  <div key={`cap-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-2 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={cap.cap_name}
                        onChange={(e) => handleDetailChange('caps', index, 'cap_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={cap.quantity}
                        onChange={(e) => handleDetailChange('caps', index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={cap.cap_type}
                        onChange={(e) => handleDetailChange('caps', index, 'cap_type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                      <select
                        value={cap.team}
                        onChange={(e) => handleDetailChange('caps', index, 'team', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      >
                        <option value="Cap Manufacturing Team">Cap Manufacturing Team</option>
                        {availableTeams.map((team, idx) => (
                          <option key={idx} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem('caps', index)}
                        className="flex items-center text-red-600 hover:text-red-800 mt-5"
                      >
                        <Minus size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Boxes Section */}
              <div className="mb-6 border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Boxes</h3>
                  <button
                    type="button"
                    onClick={() => addItem('boxes')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Box
                  </button>
                </div>

                {orderDetails.boxes.map((box, index) => (
                  <div key={`box-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-2 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={box.box_name}
                        onChange={(e) => handleDetailChange('boxes', index, 'box_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={box.quantity}
                        onChange={(e) => handleDetailChange('boxes', index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Finish</label>
                      <input
                        type="text"
                        value={box.box_finish}
                        onChange={(e) => handleDetailChange('boxes', index, 'box_finish', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                      <select
                        value={box.team}
                        onChange={(e) => handleDetailChange('boxes', index, 'team', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      >
                        <option value="Packaging Team">Packaging Team</option>
                        {availableTeams.map((team, idx) => (
                          <option key={idx} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem('boxes', index)}
                        className="flex items-center text-red-600 hover:text-red-800 mt-5"
                      >
                        <Minus size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pumps Section */}
              <div className="mb-6 border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Pumps</h3>
                  <button
                    type="button"
                    onClick={() => addItem('pumps')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Pump
                  </button>
                </div>

                {orderDetails.pumps.map((pump, index) => (
                  <div key={`pump-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-2 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={pump.pump_name}
                        onChange={(e) => handleDetailChange('pumps', index, 'pump_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={pump.quantity}
                        onChange={(e) => handleDetailChange('pumps', index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                      <select
                        value={pump.team}
                        onChange={(e) => handleDetailChange('pumps', index, 'team', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      >
                        <option value="Pump Manufacturing Team">Pump Manufacturing Team</option>
                        {availableTeams.map((team, idx) => (
                          <option key={idx} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem('pumps', index)}
                        className="flex items-center text-red-600 hover:text-red-800 mt-5"
                      >
                        <Minus size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorations Section */}
              <div className="mb-6 border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Decorations</h3>
                  <button
                    type="button"
                    onClick={() => addItem('decorations')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" /> Add Decoration
                  </button>
                </div>

                {orderDetails.decorations.map((decoration, index) => (
                  <div key={`decoration-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 p-2 bg-gray-50 rounded">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={decoration.decoration_name}
                        onChange={(e) => handleDetailChange('decorations', index, 'decoration_name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={decoration.quantity}
                        onChange={(e) => handleDetailChange('decorations', index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="text"
                        value={decoration.link}
                        onChange={(e) => handleDetailChange('decorations', index, 'link', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                      <select
                        value={decoration.team}
                        onChange={(e) => handleDetailChange('decorations', index, 'team', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        required
                      >
                        <option value="Decoration Team">Decoration Team</option>
                        {availableTeams.map((team, idx) => (
                          <option key={idx} value={team}>
                            {team}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem('decorations', index)}
                        className="flex items-center text-red-600 hover:text-red-800 mt-5"
                      >
                        <Minus size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-3 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Creating..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogBackdrop>


    </Dialog>


  );
};

export default CreateOrderModal;