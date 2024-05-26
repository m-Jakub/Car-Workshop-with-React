import React, { useEffect, useState } from "react";
import axios from "axios";
import NewEmployeeForm from "./NewEmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    const response = await axios.get(
      `https://localhost:7228/api/employeemanagement?page=${page}&pageSize=${pageSize}`
    );
    setEmployees(response.data.employees);
    setTotalEmployees(response.data.totalEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize]);

  return (
    <div>
      <h2>Employee Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Hourly Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.hourlyRate}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        Page {page} of {Math.ceil(totalEmployees / pageSize)}
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(totalEmployees / pageSize)}
        >
          Next
        </button>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Employee"}
        </button>
        {showForm && <NewEmployeeForm onEmployeeAdded={fetchEmployees} />}
      </div>
    </div>
  );
};

export default EmployeeList;
