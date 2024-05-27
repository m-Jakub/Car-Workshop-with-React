import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EmployeeManagement from "./components/EmployeeList";
import TicketManagement from "./components/TicketList";
import Calendar from "./components/Calendar";
import { logout } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("authStatus");
    const role = localStorage.getItem("userRole");
    if (authStatus) {
      setIsAuthenticated(JSON.parse(authStatus));
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem("authStatus", true);
    localStorage.setItem("userRole", role);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserRole("");
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userRole");
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
                element={
                  isAuthenticated ? (
                    <Home userRole={userRole} />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
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

const Home = ({ userRole }) => (
  <div>
    <h1>Welcome, {userRole}</h1>
  </div>
);

export default App;
