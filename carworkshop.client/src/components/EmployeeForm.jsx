import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeForm = ({ employee, onEmployeeSaved }) => {
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
          formData
        );
        if (response.status === 200) {
          onEmployeeSaved();
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } else {
        const response = await axios.post(
          "https://localhost:7228/api/employeemanagement",
          formData
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
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} style={{ color: 'red' }}>{error}</div>
          ))}
        </div>
      )}
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="number"
        value={formData.hourlyRate}
        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
        placeholder="Hourly Rate"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required={!employee} // Password required only when adding new employee
      />
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        placeholder="Confirm Password"
        required={!employee}
      />
      <button type="submit">{employee ? "Update" : "Add New Employee"}</button>
    </form>
  );
};

export default EmployeeForm;
