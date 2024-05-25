import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get(`https://localhost:7228/api/employeemanagement?page=${page}&pageSize=${pageSize}`);
            setEmployees(response.data.employees);
            setTotalEmployees(response.data.totalEmployees);
        };

        fetchEmployees();
    }, [page, pageSize]);

    return (
        <div>
            <h2>Employee Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.userName}</td>
                            <td>{employee.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                Page {page} of {Math.ceil(totalEmployees / pageSize)}
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <button onClick={() => setPage(page + 1)} disabled={page === Math.ceil(totalEmployees / pageSize)}>Next</button>
            </div>
        </div>
    );
};

export default EmployeeList;
