import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const TicketForm = ({ ticket, onTicketSaved }) => {
  const [formState, setFormState] = useState({
    brand: "",
    model: "",
    registrationId: "",
    description: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (ticket) {
      setFormState(ticket);
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!authService.isAuthenticated()) {
        navigate("/login");
        return;
      }

      if (ticket) {
        await axios.put(
          `https://localhost:7228/api/ticket/${ticket.ticketId}`,
          formState,
          { withCredentials: true }
        );
      } else {
        await axios.post("https://localhost:7228/api/ticket", formState, {
          withCredentials: true,
        });
      }
      onTicketSaved();
      setFormState({
        brand: "",
        model: "",
        registrationId: "",
        description: "",
      });
    } catch (error) {
      console.error("Error saving ticket", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="form-group">
        <button type="submit" className="btn btn-primary">
          {ticket ? "Update" : "Create"} Ticket
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
