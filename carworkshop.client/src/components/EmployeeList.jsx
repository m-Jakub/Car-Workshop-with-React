import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeForm from "./EmployeeForm";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);

  const fetchEmployees = async () => {
    const response = await axios.get(
      `https://localhost:7228/api/employeemanagement?page=${page}&pageSize=${pageSize}`
    );
    setEmployees(response.data.employees);
    setTotalEmployees(response.data.totalEmployees);
  };

  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `https://localhost:7228/api/employeemanagement/${id}`
        );
        if (response.status === 200) {
          fetchEmployees();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("Error deleting employee: " + error.response.data);
        } else {
          console.error(error);
        }
      }
    }
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
                <button
                  onClick={() => {
                    setEmployeeToUpdate(employee);
                    setShowForm(true);
                  }}
                >
                  Update
                </button>
                <button onClick={() => deleteEmployee(employee.id)}>
                  Delete
                </button>
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
        <button onClick={() => { setShowForm(!showForm); setEmployeeToUpdate(null); }}>
          {showForm ? "Cancel" : "Add New Employee"}
        </button>
        {showForm && <EmployeeForm employee={employeeToUpdate} onEmployeeSaved={fetchEmployees} />}
      </div>
    </div>
  );
};

export default EmployeeList;
