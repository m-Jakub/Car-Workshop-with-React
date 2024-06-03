import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EmployeeManagement from "./components/EmployeeList";
import TicketManagement from "./components/TicketList";
import Calendar from "./components/Calendar";
import { logout } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("authStatus")) || false
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') { // to clear local storage in development mode
      localStorage.removeItem("authStatus");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      sessionStorage.clear();
    } else {
      const authStatus = JSON.parse(localStorage.getItem("authStatus")) || false;
      setIsAuthenticated(authStatus);
      setUserRole(localStorage.getItem("userRole") || "");
      setUserName(localStorage.getItem("userName") || "");
    }
  }, []);

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
        {isAuthenticated && (
          <Navbar onLogout={handleLogout} userRole={userRole} />
        )}
        {isAuthenticated ? (
          userRole ? (
            <Routes>
              <Route
                path="/"
                element={<Home userRole={userRole} userName={userName} />}
              />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              {userRole === "Admin" && (
                <Route
                  path="/employee-management"
                  element={<EmployeeManagement />}
                />
              )}
              {userRole === "Admin" && (
                <Route
                  path="/ticket-management"
                  element={<TicketManagement />}
                />
              )}
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

const Home = ({ userRole, userName }) => (
  <div>
    <h1>Welcome, {userName}!</h1>
  </div>
);

export default App;
