import React, { useEffect, useState } from 'react';

function TicketList() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch('api/Ticket')
            .then(response => response.json())
            .then(data => setTickets(data));
    }, []);

    function handleViewParts(id) {
    }

    function handleEdit(id) {
    }

    function handleDetails(id) {
    }

    function handleDelete(id) {
    }

    return (
        <div>
            <h1>Ticket Management</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Registration ID</th>
                        <th>Description</th>
                        <th>Assigned Employee</th>
                        <th>State</th>
                        <th>Estimate Description</th>
                        <th>Expected Cost</th>
                        <th>Estimate Accepted</th>
                        <th>Price Paid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.ticketId}>
                            <td>{ticket.brand}</td>
                            <td>{ticket.model}</td>
                            <td>{ticket.registrationId}</td>
                            <td>{ticket.description}</td>
                            <td>{ticket.employeeName}</td>
                            <td>{ticket.state}</td>
                            <td>{ticket.estimateDescription}</td>
                            <td>{ticket.expectedCost}</td>
                            <td>{ticket.estimateAccepted ? 'Yes' : 'No'}</td>
                            <td>{ticket.pricePaid || '-'}</td>
                            <td>
                                <button onClick={() => handleViewParts(ticket.ticketId)}>Parts</button>
                                <button onClick={() => handleEdit(ticket.ticketId)}>Edit</button>
                                <button onClick={() => handleDetails(ticket.ticketId)}>Details</button>
                                <button onClick={() => handleDelete(ticket.ticketId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TicketList;