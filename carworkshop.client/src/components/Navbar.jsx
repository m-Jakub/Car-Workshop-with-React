import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onLogout, userRole }) {
  return (
    <nav>
      <ul>
        {userRole === "Admin" && (
          <>
            <li>
              <Link to="/employee-management">Employee Management</Link>
            </li>
            <li>
              <Link to="/ticket-management">Ticket Management</Link>
            </li>
          </>
        )}
        {userRole === "Employee" && (
          <>
            <li>
              <Link to="/calendar">Calendar</Link>
            </li>
            <li>
              <Link to="/tickets">Tickets</Link>
            </li>
          </>
        )}
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default Navbar;
