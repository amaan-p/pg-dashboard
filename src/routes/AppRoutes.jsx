import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LiveOrders from "../pages/LiveOrders";
import PastOrders from "../pages/PastOrders";
import UserDashboard from "../pages/UserDashboard";
import Login from "../pages/Login";
import NotFound from "../pages/notFound";
import { useAuth } from "../context/AuthContext";

// Modified PrivateRoutes component with improved role checking
const PrivateRoutes = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  
  // Normalize the stored role for consistent comparison
  const normalizedUserRole = userRole ? userRole.trim().toLowerCase() : null;
  const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase());
  
  console.log("PrivateRoutes check:", { 
    normalizedUserRole, 
    normalizedAllowedRoles, 
    allowed: normalizedUserRole && normalizedAllowedRoles.includes(normalizedUserRole) 
  });

  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  if (normalizedAllowedRoles && (!normalizedUserRole || !normalizedAllowedRoles.includes(normalizedUserRole))) {
    console.log(`Role ${normalizedUserRole} not in allowed roles [${normalizedAllowedRoles}], redirecting to unauth`);
    return <Navigate to="/unauth" replace />;
  }

  console.log("Access granted, rendering protected element");
  return element;
};

const AppRoutes = () => {
  const { userRole, userTeam, userLocation, loading } = useAuth();
  const navigate = useNavigate();

  // Get values from localStorage as fallback
  const storedRole = localStorage.getItem("role");
  const storedTeam = localStorage.getItem("team");
  const storedLocation = localStorage.getItem("location");
  const storedUsername = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  
  // Normalize the role for consistent comparison
  const role = userRole ? userRole.trim().toLowerCase() : (storedRole ? storedRole.trim().toLowerCase() : null);
  const team = userTeam || storedTeam;
  const location = userLocation || storedLocation;
  const username = storedUsername;

  console.log("AppRoutes state:", { 
    contextRole: userRole, 
    storedRole, 
    normalizedRole: role,
    team, 
    location, 
    loading,
    path: window.location.pathname
  });

  // Add an effect to handle initial routing once loading is complete
  useEffect(() => {
    if (!loading && token) {
      console.log("Auth loading complete, routing based on role:", role);
      
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath === "") {
        if (role === "dispatcher") {
          console.log("Dispatching to dashboard...");
          navigate("/dashboard", { replace: true });
        } else if (role === "production_team") {
          console.log("Dispatching to production team dashboard...");
          navigate(`/productionteam/${team}/${location}/dashboard`, { replace: true });
        } else {
          console.log("Unknown role, redirecting to login:", role);
          navigate("/login", { replace: true });
        }
      }
    }
  }, [loading, role, team, location, token, navigate]);

  const dashboardProps = {
    role,
    team,
    location,
    username
  };

  console.log("Dashboard props:", dashboardProps);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/unauth" element={<div>Unauthorized Access</div>} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoutes
            element={<Dashboard {...dashboardProps} />}
            allowedRoles={["dispatcher"]}
          />
        }
      >
        <Route path="live-orders" element={<LiveOrders {...dashboardProps} />} />
        <Route path="past-orders" element={<PastOrders {...dashboardProps} />} />
        <Route index element={<Navigate to="live-orders" replace />} />
      </Route>

      <Route
        path="/productionteam/:teamname/:location/dashboard"
        element={
          <PrivateRoutes
            element={<UserDashboard {...dashboardProps} />}
            allowedRoles={["production_team"]}
          />
        }
      >
        <Route path="live-orders" element={<LiveOrders {...dashboardProps} />} />
        <Route path="past-orders" element={<PastOrders {...dashboardProps} />} />
    
        <Route index element={<Navigate to="live-orders" replace />} />
      </Route>
      <Route
        path="/"
        element={
          <>
            {console.log("Root path routing check:", { token, role })}
            {token ? (
              role === "dispatcher" ? (
                <Navigate to="/dashboard" replace />
              ) : role === "production_team" ? (
                <Navigate to={`/productionteam/${team}/${location}/dashboard`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )}
          </>
        }
      />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;