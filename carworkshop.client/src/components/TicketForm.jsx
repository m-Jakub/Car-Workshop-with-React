import React, { useState, useEffect } from "react";
import axios from "axios";
import authService from "../services/authService";
import { Modal, Button } from "react-bootstrap";

const TicketForm = ({ show, handleClose, ticket, onTicketSaved }) => {
  const [formState, setFormState] = useState({
    brand: "",
    model: "",
    registrationId: "",
    description: "",
    state: "",
    estimateDescription: "",
    expectedCost: 0,
    estimateAccepted: false,
    pricePaid: 0,
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (ticket) {
      setFormState({
        brand: ticket.brand || "",
        model: ticket.model || "",
        registrationId: ticket.registrationId || "",
        description: ticket.description || "",
        state: ticket.state || "",
        estimateDescription: ticket.estimateDescription || "",
        expectedCost: ticket.expectedCost || 0,
        estimateAccepted: ticket.estimateAccepted || false,
        pricePaid: ticket.pricePaid || 0,
      });
    } else {
      setFormState({
        brand: "",
        model: "",
        registrationId: "",
        description: "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      if (!authService.isAuthenticated()) {
        navigate("/login");
        return;
      }

      if (ticket) {
        const response = await axios.put(
          `https://localhost:7228/api/ticket/${ticket.ticketId}`,
          { ...formState, TicketId: ticket.ticketId },
          { withCredentials: true }
        );
        if (response.status === 204 || response.status === 200) {
          onTicketSaved();
          handleClose();
        } else {
          setErrors(["Unexpected response status: " + response.status]);
        }
      } else {
        const response = await axios.post(
          "https://localhost:7228/api/ticket",
          formState,
          { withCredentials: true }
        );
        if (response.status === 201 || response.status === 200) {
          setFormState({
            brand: "",
            model: "",
            registrationId: "",
            description: "",
            state: "",
            estimateDescription: "",
            expectedCost: "",
            estimateAccepted: false,
            pricePaid: "",
          });
          onTicketSaved();
          handleClose();
        } else {
          setErrors(["Unexpected response status: " + response.status]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const serverErrors = error.response.data.errors || [
          error.response.data,
        ];
        setErrors(serverErrors);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {ticket ? "Edit Ticket" : "Create New Ticket"}
        </Modal.Title>
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
          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formState.brand}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formState.model}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Registration ID</label>
            <input
              type="text"
              name="registrationId"
              value={formState.registrationId}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formState.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {ticket && (
            <>
              <div className="form-group">
                <label>State</label>
                <select
                  name="state"
                  value={formState.state}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Created">Created</option>
                  <option value="In progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estimate Description</label>
                <input
                  type="text"
                  name="estimateDescription"
                  value={formState.estimateDescription}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Expected Cost</label>
                <input
                  type="number"
                  name="expectedCost"
                  value={formState.expectedCost}
                  onChange={handleChange}
                  className="form-control"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="estimateAccepted"
                    checked={formState.estimateAccepted}
                    onChange={handleChange}
                  />
                  Estimate Accepted
                </label>
              </div>
              <div className="form-group">
                <label>Price Paid</label>
                <input
                  type="number"
                  name="pricePaid"
                  value={formState.pricePaid}
                  onChange={handleChange}
                  className="form-control"
                  step="0.01"
                />
              </div>
            </>
          )}

          <div className="d-grid">
            <Button type="submit" variant="primary">
              {ticket ? "Update" : "Create"} Ticket
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TicketForm;
