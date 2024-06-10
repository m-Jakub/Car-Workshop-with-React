import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const EmployeeForm = ({ show, handleClose, employee, onEmployeeSaved }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hourlyRate: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        hourlyRate: employee.hourlyRate,
        password: "",
        confirmPassword: ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        hourlyRate: "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [employee]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);

    if (formData.password !== formData.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    try {
      if (employee) {
        const response = await axios.put(
          `https://localhost:7228/api/employeemanagement/${employee.id}`,
          formData,
          {withCredentials: true}
        );
        if (response.status === 200) {
          onEmployeeSaved();
          handleClose();
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } else {
        const response = await axios.post(
          "https://localhost:7228/api/employeemanagement",
          formData,
          {withCredentials: true}
        );
        if (response.status === 200) {
          setFormData({
            name: "",
            email: "",
            hourlyRate: "",
            password: "",
            confirmPassword: ""
          });
          onEmployeeSaved();
          handleClose();
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const serverErrors = error.response.data.errors || [error.response.data];
        setErrors(serverErrors);
      } else {
        console.error(error);
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{employee ? "Edit Employee" : "Add New Employee"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="hourlyRate" className="form-label">Hourly Rate</label>
            <input
              type="number"
              id="hourlyRate"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              className="form-control"
              placeholder="Hourly Rate"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-control"
              placeholder="Password"
              required={!employee}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="form-control"
              placeholder="Confirm Password"
              required={!employee}
            />
          </div>
          <div className="d-grid">
            <Button type="submit" variant="primary">
              {employee ? "Update" : "Add New Employee"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeForm;
