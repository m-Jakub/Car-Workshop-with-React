import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketForm from "./TicketForm";
import TicketAssignmentCalendar from "./TicketAssignmentCalendar";
import PartList from "./PartList";

const TicketList = ({ userRole }) => {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [ticketToUpdate, setTicketToUpdate] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketIdForParts, setSelectedTicketIdForParts] =
    useState(null);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7228/api/Calendar/user",
          { withCredentials: true }
        );
        setEmployeeId(response.data.id);
      } catch (error) {
        console.error("Error fetching employee ID:", error);
      }
    };

    fetchEmployeeId();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7228/api/ticket?page=${page}&pageSize=${pageSize}`,
        { withCredentials: true }
      );
      setTickets(response.data.tickets);
      setTotalTickets(response.data.totalTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const acceptTicket = (ticketId) => {
    setSelectedTicket(ticketId);
  };

  const handleConfirmAssignment = async (selectedTimeSlots) => {
    try {
      const response = await axios.post(
        `https://localhost:7228/api/ticket/accept/${selectedTicket}`,
        { employeeId, timeSlotIds: selectedTimeSlots },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSelectedTicket(null);
        fetchTickets();
      }
    } catch (error) {
      console.error("Error accepting ticket:", error);
    }
  };

  const deleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `https://localhost:7228/api/ticket/${id}`,
          { withCredentials: true }
        );
        if (response.status === 204) {
          fetchTickets();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, pageSize]);

  return (
    <div>
      <h2>Ticket Management</h2>
      {selectedTicket ? (
        <TicketAssignmentCalendar
          selectedTicketId={selectedTicket}
          onConfirm={handleConfirmAssignment}
        />
      ) : selectedTicketIdForParts ? (
        <PartList
          ticketId={selectedTicketIdForParts}
          onBack={() => setSelectedTicketIdForParts(null)}
        />
      ) : (
        <>
          <table>
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
              {tickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>{ticket.brand}</td>
                  <td>{ticket.model}</td>
                  <td>{ticket.registrationId}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.employeeName || "Not assigned"}</td>
                  <td>{ticket.state}</td>
                  <td>{ticket.estimateDescription}</td>
                  <td>{ticket.expectedCost}</td>
                  <td>{ticket.estimateAccepted ? "Yes" : "No"}</td>
                  <td>{ticket.pricePaid || "-"}</td>
                  <td>
                    {userRole === "Admin" ? (
                      <>
                        <button
                          onClick={() => {
                            setTicketToUpdate(ticket);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteTicket(ticket.ticketId)}>
                          Delete
                        </button>
                        <button
                          onClick={() =>
                            setSelectedTicketIdForParts(ticket.ticketId)
                          }
                        >
                          Manage Parts
                        </button>
                      </>
                    ) : ticket.employeeName &&
                      ticket.employeeName !== "Not assigned" ? (
                      "-"
                    ) : (
                      <button onClick={() => acceptTicket(ticket.ticketId)}>
                        Accept Ticket
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            Page {page} of {Math.ceil(totalTickets / pageSize)}
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === Math.ceil(totalTickets / pageSize)}
            >
              Next
            </button>
            {userRole === "Admin" && (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setTicketToUpdate(null);
                }}
              >
                {showForm ? "Cancel" : "Add New Ticket"}
              </button>
            )}
            {showForm && userRole === "Admin" && (
              <TicketForm
                ticket={ticketToUpdate}
                onTicketSaved={() => {
                  fetchTickets();
                  setShowForm(false);
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TicketList;
