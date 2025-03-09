import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Plus, Menu, X } from 'lucide-react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import CreateOrder from '../components/CreateOrder';
import ConfirmOrder from '../components/ConfirmOrder';
import LiveOrders from './LiveOrders';

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [completeOrder, setCompleteOrder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getActiveRoute = () => {
    const path = location.pathname;
    if (path.includes('live-orders')) return 'live-orders';
    if (path.includes('past-orders')) return 'past-orders';
    return 'live-orders';
  };

  // Combine the two useEffect hooks that fetch orders into one
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        const allOrders = response.data.Orders || [];

        // Count pending and completed orders
        const pending = allOrders.filter(order => order.order_status === "Pending").length;
        const completed = allOrders.filter(order => order.order_status === "Completed").length;

        setPendingOrders(pending);
        setCompletedOrders(completed);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [showModal, completeOrder, refreshTrigger]); // Include refreshTrigger in dependencies

  // Separate useEffect for responsive behavior
  useEffect(() => {
    // Add responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    // Navigate to order details or open a modal
  };

  const handleCompleteOrder = (order) => {
    setSelectedOrder(order);
    setCompleteOrder(true);
  };

  // Add a function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Modified function to close modal and trigger refresh
  const handleCloseModal = () => {
    setShowModal(false);
    triggerRefresh();
  };

  // Modified function to close confirm modal and trigger refresh
  const handleCloseConfirmModal = () => {
    setCompleteOrder(false);
    triggerRefresh();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if we're on the past-orders route
  const isPastOrdersRoute = location.pathname.includes('past-orders');

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-2 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - responsive */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-90 md:z-0 fixed md:relative md:translate-x-0 w-64 h-screen bg-orange-400 text-white transition-transform duration-300 ease-in-out shadow-lg`}>
        <div className="p-4 text-center mt-8 md:mt-0">
          <img src="/logo.png" className="h-12" alt="Logo" />
        </div>

        <nav className="mt-6">
          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${getActiveRoute() === 'live-orders' ? 'bg-orange-500' : 'hover:bg-orange-500'}`}
            onClick={() => {
              navigate('/dashboard/live-orders');
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <span className="ml-2">LIVE ORDERS</span>
          </div>

          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${getActiveRoute() === 'past-orders' ? 'bg-orange-500' : 'hover:bg-orange-500'}`}
            onClick={() => {
              navigate('/dashboard/past-orders');
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <span className="ml-2">PAST ORDERS</span>
          </div>
        </nav>

        <div className="absolute bottom-4 w-full">
          <div
            className="flex items-center justify-center px-4 py-2 mx-auto w-4/5 bg-red-500 rounded cursor-pointer hover:bg-red-400"
            onClick={logout}
          >
            <span>LOGOUT</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content - responsive with improved layout */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden ${sidebarOpen ? 'md:ml-0' : ''}`}>
        {/* Header */}
        <header className="bg-white p-4 shadow-md z-10">
          <div className="flex justify-between items-center">
            <div className="ml-8 md:ml-0">
              <span className="text-black text-xl font-bold">Welcome </span>
              <span className="text-orange-500 text-xl font-bold">Dispatcher,</span>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="bg-white p-4 md:p-6">
          {/* Stats Cards - only show on current orders */}
          {!isPastOrdersRoute && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="bg-orange-400 rounded-lg p-4 text-white shadow-md transform transition-transform hover:scale-105">
                <h2 className="text-3xl font-bold text-center">{pendingOrders}</h2>
                <p className="mt-1 text-center">Order Pending</p>
              </div>

              <div className="bg-green-500 rounded-lg p-4 text-white shadow-md transform transition-transform hover:scale-105">
                <h2 className="text-3xl font-bold text-center">{completedOrders}</h2>
                <p className="mt-1 text-center">Order Completed</p>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-2 sm:flex-row justify-between items-start sm:items-center ">
            <div>
              <span className="text-black text-xl font-bold">{isPastOrdersRoute ? "Past" : "Current"} </span>
              <span className="text-orange-400 text-xl font-bold">Orders</span>
            </div>

            {!isPastOrdersRoute && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-colors duration-200"
              >
                <Plus size={18} /> Create Order
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scroll-smooth pb-4" id="orders-container">
            {/* Use Outlet to render the nested route components */}
            {isPastOrdersRoute ? (
              <Outlet key={location.pathname} />
            ) : (
              <LiveOrders
                allorders={orders}
                loading={loading}
                onCompleteOrder={handleCompleteOrder}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && <CreateOrder onClose={handleCloseModal} />}

      {/* Complete Order Confirmation Modal */}
      {completeOrder && (
        <ConfirmOrder
          onClose={handleCloseConfirmModal}
          order={selectedOrder}
        />
      )}

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #FF9800;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #F57C00;
        }
        
        .scroll-smooth {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;