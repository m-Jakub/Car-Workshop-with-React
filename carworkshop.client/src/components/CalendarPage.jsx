import React, { useState } from 'react';
import Calendar from './Calendar';
import axios from 'axios';

const CalendarPage = () => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSlotClick = (timeSlotId) => {
    if (!selectedTicket) {
      const newStatus = 'Available'; //                                     TO BE CHECKED
      updateTimeSlotStatus(timeSlotId, newStatus);
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlotId]);
    }
  };

  const updateTimeSlotStatus = async (timeSlotId, status) => {
    try {
      await axios.post('/api/calendar/timeslots', { timeSlotId, availabilityStatus: status });
    } catch (error) {
      console.error('Error updating time slot status', error);
    }
  };

  const assignTicketToSlots = async () => {
    if (!selectedTicket || selectedTimeSlots.length === 0) return;

    try {
      await axios.post('/api/calendar/tickets/assign', {
        ticketId: selectedTicket,
        timeSlotIds: selectedTimeSlots,
      });
    } catch (error) {
      console.error('Error assigning ticket to slots', error);
    }
  };

  return (
    <div>
      <h2>Calendar</h2>
      <Calendar onSlotClick={handleSlotClick} selectedTicket={selectedTicket} />
      {selectedTicket && (
        <button onClick={assignTicketToSlots}>Assign Ticket to Selected Slots</button>
      )}
    </div>
  );
};

export default CalendarPage;
