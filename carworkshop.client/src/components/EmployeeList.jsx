import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeForm from "./EmployeeForm";
import { Table, Pagination } from "react-bootstrap";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);

  const fetchEmployees = async () => {
    const response = await axios.get(
      `https://localhost:7228/api/employeemanagement?page=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
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
          `https://localhost:7228/api/employeemanagement/${id}`,
          { withCredentials: true }
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
    <div className="margins"> 
      <h2 className="mb-4">Employee Management</h2>
      <Table striped bordered hover>
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
                    setShowModal(true);
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
      </Table>
      <div className="d-flex justify-content-between align-items-center">
        <Pagination>
          <Pagination.Prev
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
          <Pagination.Item>{page}</Pagination.Item>
          <Pagination.Next
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(totalEmployees / pageSize)}
          />
        </Pagination>
        <button
          variant="success"
          onClick={() => {
            setShowModal(!showModal);
            setEmployeeToUpdate(null);
          }}
        >
          Add New Employee
        </button>
      </div>
      {showModal && (
        <EmployeeForm
          show={showModal}
          handleClose={() => setShowModal(false)}
          employee={employeeToUpdate}
          onEmployeeSaved={fetchEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeList;
