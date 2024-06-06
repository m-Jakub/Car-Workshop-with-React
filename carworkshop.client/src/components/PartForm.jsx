import React, { useState, useEffect } from "react";
import axios from "axios";

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
      });
    } else {
      setFormData({
        name: "",
        amount: 1,
        unitPrice: 0.0,
      });
    }
  }, [part]);

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
          { ...formData, ticketId },
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
          { ...formData, ticketId },
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
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <div key={index} style={{ color: "red" }}>
              {error}
            </div>
          ))}
        </div>
      )}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="form-control"
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label>Unit Price</label>
        <input
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          className="form-control"
          step="0.01"
          required
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-primary">
          {part ? "Update Part" : "Add Part"}
        </button>
      </div>
    </form>
  );
};

export default PartForm;
