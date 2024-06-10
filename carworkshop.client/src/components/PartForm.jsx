import React, { useState, useEffect } from "react";
import axios from "axios";
import PartForm from "./PartForm";
import { Modal, Button, Table } from "react-bootstrap";

const PartList = ({ ticketId, onBack }) => {
  const [parts, setParts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [partToUpdate, setPartToUpdate] = useState(null);

  const fetchParts = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7228/api/part?ticketId=${ticketId}`,
        { withCredentials: true }
      );
      setParts(response.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const deletePart = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this part?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `https://localhost:7228/api/part/${id}`,
          { withCredentials: true }
        );
        if (response.status === 204) {
          fetchParts();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchParts();
  }, [ticketId]);

  return (
    <div>
      <h2>Parts Management</h2>
      <Button variant="secondary" onClick={onBack}>
        Back to Ticket List
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.partId}>
              <td>{part.name}</td>
              <td>{part.amount}</td>
              <td>{part.unitPrice}</td>
              <td>{part.totalPrice}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => {
                    setPartToUpdate(part);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deletePart(part.partId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="success"
        onClick={() => {
          setShowForm(!showForm);
          setPartToUpdate(null);
        }}
      >
        {showForm ? "Cancel" : "Add New Part"}
      </Button>
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{partToUpdate ? "Edit Part" : "Add New Part"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PartForm
            part={partToUpdate}
            onPartSaved={() => {
              fetchParts();
              setShowForm(false);
            }}
            ticketId={ticketId}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PartList;
