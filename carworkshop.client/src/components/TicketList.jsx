import React, { useEffect, useState } from "react";
import axios from "axios";
import TicketForm from "./TicketForm";
import TicketAssignmentCalendar from "./TicketAssignmentCalendar";
import PartList from "./PartList";
import { Table, Pagination } from "react-bootstrap";

const TicketList = ({ userRole }) => {
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTickets, setTotalTickets] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
    <div className="margins">
      <h2 className="mb-4">Ticket Management</h2>
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
          <Table striped bordered hover>
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
                  <td>{ticket.expectedCost || ""}</td>
                  <td>{ticket.estimateAccepted ? "Yes" : "No"}</td>
                  <td>{ticket.pricePaid || ""}</td>
                  <td>
                    {userRole === "Admin" ? (
                      <>
                        <button
                          variant="primary"
                          onClick={() => {
                            setTicketToUpdate(ticket);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          variant="danger"
                          onClick={() => deleteTicket(ticket.ticketId)}
                        >
                          Delete
                        </button>
                        <button
                          variant="secondary"
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
                      <button
                        variant="success"
                        onClick={() => acceptTicket(ticket.ticketId)}
                      >
                        Accept Ticket
                      </button>
                    )}
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
                disabled={page === Math.ceil(totalTickets / pageSize)}
              />
            </Pagination>
            {userRole === "Admin" && (
              <button
                variant="success"
                onClick={() => {
                  setShowModal(true);
                  setTicketToUpdate(null);
                }}
              >
                Add New Ticket
              </button>
            )}
          </div>
          {showModal && userRole === "Admin" && (
            <TicketForm
              show={showModal}
              handleClose={() => setShowModal(false)}
              ticket={ticketToUpdate}
              onTicketSaved={fetchTickets}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TicketList;
