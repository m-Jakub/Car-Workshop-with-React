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
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {userRole === "Admin" && (
              <>
                <Nav.Link as={Link} to="/employee-management">
                  Employee Management
                </Nav.Link>
                <Nav.Link as={Link} to="/ticket-management">
                  Ticket Management
                </Nav.Link>
              </>
            )}
            {userRole === "Employee" && (
              <>
                <Nav.Link as={Link} to="/calendar">
                  Calendar
                </Nav.Link>
                <Nav.Link as={Link} to="/tickets">
                  Tickets
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Item>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </Nav.Item>
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
