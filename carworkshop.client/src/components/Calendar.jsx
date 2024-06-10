import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import "./Calendar.css";

const Calendar = () => {
  const [timeSlots, setTimeSlots] = useState({});
  const [employeeId, setEmployeeId] = useState(null);

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

    const fetchEmployeeId = async () => {
      try {
        const response = await axiosInstance.get("/Calendar/user");
        setEmployeeId(response.data.id);
      } catch (error) {
        console.error("Error fetching employee ID:", error);
      }
    };

    fetchTimeSlots();
    fetchEmployeeId();
  }, []);

  const handleCellClick = async (dayOfWeek, hour) => {
    const existingTimeSlot = timeSlots[`${dayOfWeek}-${hour}`];

    if (existingTimeSlot) {
      if (existingTimeSlot.availabilityStatus === "Busy") return;
      await axiosInstance.delete(
        `/Calendar/DeleteTimeSlot/${existingTimeSlot.timeSlotId}`
      );
      setTimeSlots((prev) => {
        const updated = { ...prev };
        delete updated[`${dayOfWeek}-${hour}`];
        return updated;
      });
    } else {
      const newTimeSlot = {
        employeeId,
        dayOfWeek,
        hour,
        availabilityStatus: "Available",
      };

      const response = await axiosInstance.post(
        "/Calendar/CreateTimeSlot",
        newTimeSlot
      );
      setTimeSlots((prev) => ({
        ...prev,
        [`${dayOfWeek}-${hour}`]: {
          ...newTimeSlot,
          timeSlotId: response.data.timeSlotId,
        },
      }));
    }
  };

  const renderTable = () => {
    const rows = [];

    for (let hour = 6; hour < 20; hour++) {
      const cells = [
        <td key={`hour-${hour}`} className="time-column">{`${hour}:00 - ${
          hour + 1
        }:00`}</td>,
      ];

      for (let day = 0; day < 7; day++) {
        const key = `${day}-${hour}`;
        const slot = timeSlots[key];
        const status = slot ? slot.availabilityStatus : "Unavailable";
        const cellClass =
          status === "Available"
            ? "available-cell"
            : status === "Busy"
            ? "busy-cell"
            : "unavailable-cell";

        cells.push(
          <td
            key={key}
            className={`day-column ${cellClass}`}
            onClick={() => handleCellClick(day, hour)}
          ></td>
        );
      }

      rows.push(<tr key={`row-${hour}`}>{cells}</tr>);
    }

    return rows;
  };

  return (
    <div className="margins">
      <h2>Schedule</h2>
      <p className="text-center">Click on a cell to toggle availability</p>
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
    </div>
  );
};

export default Calendar;
