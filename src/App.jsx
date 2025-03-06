import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import LiveOrders from './pages/LiveOrders';
import PastOrders from './pages/PastOrders';
import PrivateRoutes from './components/PrivateRoutes';
import { getItemsFromLocalStorage } from './utility/utils';

function App() {
  const { role, location, team } = getItemsFromLocalStorage();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {role === 'dispatcher' && (
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard/*" element={<Dashboard />}>
              <Route index element={<LiveOrders />} />
              <Route path="live-orders" element={<LiveOrders />} />
              <Route path="past-orders" element={<PastOrders />} />
            </Route>
          </Route>
        )}

        {role !== 'dispatcher' && (
          <Route element={<PrivateRoutes />}>
            <Route path="/UserDashboard/*" element={<UserDashboard />}>
              <Route
                index
                element={<Navigate to={`${role}/${team}/${location}/live-orders`} replace />}
              />
              <Route
                path=":userRole/:userTeam/:userLocation/live-orders"
                element={<LiveOrders />}
              />
              <Route
                path=":userRole/:userTeam/:userLocation/past-orders"
                element={<PastOrders />}
              />
            </Route>
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
