import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

import { Outlet } from 'react-router-dom';

const UserDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const team = localStorage.getItem('team')
  const userLoc = localStorage.getItem("location")
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getActiveRoute = () => {
    const path = location.pathname;
    if (path.includes('live-orders')) return 'live-orders';
    if (path.includes('past-orders')) return 'past-orders';
    return 'live-orders';
  };

  useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white relative">

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
              navigate(`/productionteam/${team}/${userLoc}/dashboard/live-orders`);
              if (window.innerWidth < 768) setSidebarOpen(false);
            }}
          >
            <span className="ml-2">LIVE ORDERS</span>
          </div>

          <div
            className={`flex items-center px-4 py-3 cursor-pointer ${getActiveRoute() === 'past-orders' ? 'bg-orange-500' : 'hover:bg-orange-500'}`}
            onClick={() => {
              navigate(`/productionteam/${team}/${userLoc}/dashboard/past-orders`);
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
              <span className="text-orange-500 text-xl font-bold">{`${team}-${userLoc}`}</span>
            </div>
          </div>
        </header>

        {/* Stats Section */}

        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scroll-smooth pb-4" id="orders-container">
            {/* Use Outlet to render the nested route components */}
            <div className="h-full overflow-y-auto pr-2 scroll-smooth pb-4" id="orders-container">
              <Outlet key={location.pathname} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;