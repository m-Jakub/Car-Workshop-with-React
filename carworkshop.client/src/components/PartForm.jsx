import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

const PartForm = ({ part, onPartSaved, ticketId }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: 1,
    unitPrice: 0.0,
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        amount: part.amount,
        unitPrice: part.unitPrice,
        ticketId: ticketId,
        partId: part.partId,
      });
    } else {
      setFormData({
        name: "",
        amount: 1,
        unitPrice: 0.0,
        ticketId: ticketId,
      });
    }
  }, [part, ticketId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      if (part) {
        const response = await axios.put(
          `https://localhost:7228/api/part/${part.partId}`,
          formData,
          { withCredentials: true }
        );
        if (response.status === 200 || response.status === 204) {
          onPartSaved();
        } else {
          setErrors(["Unexpected response status: " + response.status]);
        }
      } else {
        const response = await axios.post(
          "https://localhost:7228/api/part",
          formData,
          { withCredentials: true }
        );
        if (response.status === 200 || response.status === 201) {
          onPartSaved();
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
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} style={{ color: "red" }}>
              {error}
            </div>
          ))}
        </div>
      )}
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Unit Price</Form.Label>
        <Form.Control
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          step="0.01"
          required
        />
      </Form.Group>
      <button type="submit" variant="primary">
        {part ? "Update Part" : "Add Part"}
      </button>
    </Form>
  );
};

export default PartForm;
