import React, { useState } from "react";
import axios from "axios";

const NewEmployeeForm = ({ onEmployeeAdded }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    hourlyRate: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState([]);

  const addEmployee = async (event) => {
    event.preventDefault();
    setErrors([]); // Clear previous errors

    if (newEmployee.password !== newEmployee.confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7228/api/employeemanagement",
        newEmployee
      );
      if (response.status === 200) {
        setNewEmployee({ name: "", email: "", hourlyRate: "", password: "", confirmPassword: "" });
        onEmployeeAdded();
      } else {
        console.error(`Unexpected response status: ${response.status}`);
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
    <form onSubmit={addEmployee}>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} style={{ color: 'red' }}>{error}</div>
          ))}
        </div>
      )}
      <input
        type="text"
        value={newEmployee.name}
        onChange={(e) =>
          setNewEmployee({ ...newEmployee, name: e.target.value })
        }
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={newEmployee.email}
        onChange={(e) =>
          setNewEmployee({ ...newEmployee, email: e.target.value })
        }
        placeholder="Email"
        required
      />
      <input
        type="number"
        value={newEmployee.hourlyRate}
        onChange={(e) =>
          setNewEmployee({ ...newEmployee, hourlyRate: e.target.value })
        }
        placeholder="Hourly Rate"
        required
      />
      <input
        type="password"
        value={newEmployee.password}
        onChange={(e) =>
          setNewEmployee({ ...newEmployee, password: e.target.value })
        }
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={newEmployee.confirmPassword}
        onChange={(e) =>
          setNewEmployee({ ...newEmployee, confirmPassword: e.target.value })
        }
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Add New Employee</button>
    </form>
  );
};

export default NewEmployeeForm;
