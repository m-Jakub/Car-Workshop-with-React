import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar, Nav } from "react-bootstrap";
import './Navbar.css';

const variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: "-100%" },
};

function Navigation({ onLogout, userRole }) {
  return (
    <motion.div
      initial="closed"
      animate="open"
      variants={variants}
      transition={{ duration: 0.8 }}
      style={{ width: "100%" }}
    >
      <Navbar bg="light" expand="lg" style={{ width: "100%" }}>
        <Navbar.Brand>
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {userRole === "Admin" && (
              <>
                <Nav.Link>
                  <Link to="/employee-management">Employee Management</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/ticket-management">Ticket Management</Link>
                </Nav.Link>
              </>
            )}
            {userRole === "Employee" && (
              <>
                <Nav.Link>
                  <Link to="/calendar">Calendar</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/tickets">Tickets</Link>
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Link>
              <button variant="outline-danger" onClick={onLogout}>
                Logout
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </motion.div>
  );
}

Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default Navigation;
