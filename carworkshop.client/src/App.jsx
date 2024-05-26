import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import EmployeeManagement from "./components/EmployeeList";
import TicketManagement from "./components/TicketManagement";
import Calendar from "./components/Calendar";
import Tickets from "./components/Tickets";
import { logout } from "./services/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar onLogout={handleLogout} userRole={userRole} />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home userRole={userRole} /> : <Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
          <Route path="/ticket-management" element={<TicketManagement />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
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
