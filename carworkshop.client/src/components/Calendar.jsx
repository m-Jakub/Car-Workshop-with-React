import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Calendar = () => {
    const [timeSlots, setTimeSlots] = useState({});
    const [employeeId, setEmployeeId] = useState(null);

    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get('https://localhost:7228/api/Calendar/timeslots');
                setTimeSlots(response.data);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };

        const fetchEmployeeId = async () => {
            try {
                const response = await axios.get('https://localhost:7228/api/Calendar/user');
                setEmployeeId(response.data.id);
                console.log(response.data.id);
                console.log(employeeId);
                console.log(response);
            } catch (error) {
                console.error('Error fetching employee ID:', error);
            }
        };

        fetchTimeSlots();
        fetchEmployeeId();
    }, []);

    const handleCellClick = async (dayOfWeek, hour) => {
        const existingTimeSlot = timeSlots[`${dayOfWeek}-${hour}`];

        if (existingTimeSlot) {
            await axios.delete(`https://localhost:7228/api/Calendar/DeleteTimeSlot/${existingTimeSlot.timeSlotId}`);
            setTimeSlots(prev => {
                const updated = { ...prev };
                delete updated[`${dayOfWeek}-${hour}`];
                return updated;
            });
        } else {
            const newTimeSlot = {
                employeeId,
                dayOfWeek,
                hour,
                availabilityStatus: "Available"
            };

            const response = await axios.post('https://localhost:7228/api/Calendar/CreateTimeSlot', newTimeSlot);
            setTimeSlots(prev => ({
                ...prev,
                [`${dayOfWeek}-${hour}`]: {
                    ...newTimeSlot,
                    timeSlotId: response.data.timeSlotId
                }
            }));
        }
    };

    const renderTable = () => {
        const rows = [];

        for (let hour = 6; hour < 20; hour++) {
            const cells = [<td key={`hour-${hour}`}>{`${hour}:00 - ${hour + 1}:00`}</td>];

            for (let day = 0; day < 7; day++) {
                const key = `${day}-${hour}`;
                const slot = timeSlots[key];
                const status = slot ? slot.availabilityStatus : "Unavailable";

                cells.push(
                    <td
                        key={key}
                        className={`day-column ${status === "Available" ? "available-cell" : ""}`}
                        onClick={() => handleCellClick(day, hour)}
                    >
                        {status}
                    </td>
                );
            }

            rows.push(<tr key={`row-${hour}`}>{cells}</tr>);
        }

        return rows;
    };

    return (
        <div>
            <h2>Schedule</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th className="time-column">Time</th>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                            <th key={index} className="day-column">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {renderTable()}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
