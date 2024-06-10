import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const TicketAssignmentCalendar = ({ selectedTicketId, onConfirm }) => {
  const [timeSlots, setTimeSlots] = useState({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axiosInstance.get("/Calendar/timeslots");
        const slots = response.data.reduce((acc, slot) => {
          acc[`${slot.dayOfWeek}-${slot.hour}`] = slot;
          return acc;
        }, {});
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleCellClick = (dayOfWeek, hour) => {
    const key = `${dayOfWeek}-${hour}`;
    const slot = timeSlots[key];
    if (slot && slot.availabilityStatus === "Available") {
      setSelectedTimeSlots((prev) => {
        if (prev.includes(slot.timeSlotId)) {
          return prev.filter((id) => id !== slot.timeSlotId);
        } else {
          return [...prev, slot.timeSlotId];
        }
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedTimeSlots);
  };

  const renderTable = () => {
    const rows = [];
    for (let hour = 6; hour < 20; hour++) {
      const cells = [
        <td key={`hour-${hour}`}>{`${hour}:00 - ${hour + 1}:00`}</td>,
      ];

      for (let day = 0; day < 7; day++) {
        const key = `${day}-${hour}`;
        const slot = timeSlots[key];
        const status = slot ? slot.availabilityStatus : "Unavailable";
        const isSelected = selectedTimeSlots.includes(slot?.timeSlotId);

        cells.push(
          <td
            key={key}
            className={`day-column ${
              status === "Available"
                ? isSelected
                  ? "selected-cell"
                  : "available-cell"
                : status === "Busy"
                ? "busy-cell"
                : "unavailable-cell"
            }`}
            onClick={() => handleCellClick(day, hour)}
          >
          </td>
        );
      }

      rows.push(<tr key={`row-${hour}`}>{cells}</tr>);
    }

    return rows;
  };

  return (
    <div>
      <h3 className="text-center">Assign Time Slots to Ticket</h3>
      <p className="text-center">Select available time slots to assign to the ticket.</p>
      <table className="table">
        <thead>
          <tr>
            <th className="time-column">Time</th>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <th key={index} className="day-column">
                  {day}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </table>
      <button onClick={handleConfirm}>Confirm Assignment</button>
    </div>
  );
};

export default TicketAssignmentCalendar;
