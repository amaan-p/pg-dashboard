import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  removeItemsFromLocalStorage,
  saveToLocalStorage,
} from "../utility/utils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    const storedUserTeam = localStorage.getItem("team");
    const storedUserLocation = localStorage.getItem("location");

    setUserRole(storedUserRole);
    setUserTeam(storedUserTeam);
    setUserLocation(storedUserLocation);
    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    try {
      console.log("Login attempt for:", username);
      
      const response = await axios.post(
        "https://pg-dash-backend.vercel.app/api/login",
        {
          username,
          password,
        }
      );

      // Check if data exists and has the expected structure
      if (!response.data) {
        throw new Error("No data received from server");
      }

      console.log("Login response received:", response.data);

      const { role, location, team, token } = response.data;
      
      // Normalize the role to prevent case mismatches
      const normalizedRole = role ? role.trim().toLowerCase() : null;

      // Verify role is defined
      if (!normalizedRole) {
        throw new Error("Role not defined in server response");
      }

      console.log("Normalized role:", normalizedRole);

      // Save data to localStorage
      saveToLocalStorage("username", username);
      saveToLocalStorage("token", token);
      saveToLocalStorage("role", normalizedRole);

      if (normalizedRole !== "dispatcher") {
        saveToLocalStorage("location", location || "");
        saveToLocalStorage("team", team || "");
      }

      // Update state
      setUserRole(normalizedRole);
      setUserTeam(team || null);
      setUserLocation(location || null);

      // Ensure localStorage is updated before navigation
      setTimeout(() => {
        console.log("Navigating based on role:", normalizedRole);
        
        if (normalizedRole === "production_team") {
          console.log("Routing to production team dashboard");
          navigate(`/productionteam/${team}/${location}/dashboard`, { replace: true });
        } else if (normalizedRole === "dispatcher") {
          console.log("Routing to dispatcher dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          // Default route for other role types
          console.log("Routing to default route for role:", normalizedRole);
          navigate("/default-route", { replace: true });
        }
        
        console.log("Navigation completed");
      }, 100);
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    removeItemsFromLocalStorage();
    setUserRole(null);
    setUserTeam(null);
    setUserLocation(null);
    navigate("/login");
  };

  const value = {
    userRole,
    userTeam,
    userLocation,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;