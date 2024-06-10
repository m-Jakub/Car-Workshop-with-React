import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axiosInstance from "./services/axiosInstance";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EmployeeManagement from "./components/EmployeeList";
import TicketManagement from "./components/TicketList";
import Calendar from "./components/Calendar";
import { logout } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Clear local storage in development mode
      localStorage.removeItem("authStatus");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      sessionStorage.clear();
    } else {
      const authStatus = JSON.parse(localStorage.getItem("authStatus"));
      const storedUserRole = localStorage.getItem("userRole");
      const storedUserName = localStorage.getItem("userName");

      if (authStatus && storedUserRole && storedUserName) {
        setIsAuthenticated(authStatus);
        setUserRole(storedUserRole);
        setUserName(storedUserName);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      const checkAuthStatus = async () => {
        try {
          const response = await axiosInstance.get("/auth/status");
          if (response.data.isAuthenticated) {
            setIsAuthenticated(true);
            setUserRole(response.data.role);
            setUserName(response.data.name);
            localStorage.setItem("authStatus", JSON.stringify(true));
            localStorage.setItem("userRole", response.data.role);
            localStorage.setItem("userName", response.data.name);
          }
        } catch (error) {
          console.error("Error checking authentication status:", error);
        }
      };

      checkAuthStatus();
    }
  }, [isAuthenticated]);

  const handleLogin = (role, name) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    localStorage.setItem("authStatus", JSON.stringify(true));
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserRole("");
      setUserName("");
      localStorage.removeItem("authStatus");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar onLogout={handleLogout} userRole={userRole} />}
        <div style={{ paddingTop: "56px" }}>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home userRole={userRole} userName={userName} />} />
                <Route path="/login" element={<Navigate to="/" />} />
                {userRole === "Admin" && (
                  <>
                    <Route path="/employee-management" element={<EmployeeManagement />} />
                    <Route path="/ticket-management" element={<TicketManagement userRole={userRole} />} />
                  </>
                )}
                {userRole === "Employee" && (
                  <>
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/tickets" element={<TicketManagement userRole={userRole} />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const Home = ({ userRole, userName }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <h1 className="pulse">Welcome, {userName}!</h1>
  </div>
);

export default App;
