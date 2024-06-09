using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CarWorkshop.Server.Data;
using CarWorkshop.Server.Models;

namespace CarWorkshop.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CalendarController> _logger;

        public CalendarController(AppDbContext context, ILogger<CalendarController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("timeslots")]
        public async Task<IActionResult> GetTimeSlots()
        {
            string? employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var timeSlots = await _context.TimeSlot
                .Where(ts => ts.EmployeeId == employeeId)
                .ToListAsync();
            return Ok(timeSlots);
        }

        [HttpPost("CreateTimeSlot")]
        public async Task<IActionResult> CreateTimeSlot([FromBody] TimeSlot timeSlot)
        {
            if (timeSlot == null)
            {
                return BadRequest(new { success = false, error = "Invalid TimeSlot data" });
            }

            var employee = await _context.Users.FindAsync(timeSlot.EmployeeId);
            if (employee == null)
            {
                return BadRequest(new { success = false, error = "Employee not found" });
            }

            timeSlot.Employee = employee;
            _context.TimeSlot.Add(timeSlot);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, timeSlotId = timeSlot.TimeSlotId });
        }

        [HttpDelete("DeleteTimeSlot/{id}")]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {

            var timeSlot = await _context.TimeSlot.FindAsync(id);
            if (timeSlot == null)
            {
                return NotFound(new { success = false, error = "TimeSlot not found" });
            }
            if (timeSlot.AvailabilityStatus == "Busy")
            {
                return BadRequest(new { success = false, error = "TimeSlot is busy" });
            }

            _context.TimeSlot.Remove(timeSlot);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }


        [HttpPost("timeslots")]
        public async Task<IActionResult> ChangeTimeSlotStatus([FromBody] TimeSlotUpdateRequest request)
        {
            var timeSlot = await _context.TimeSlot.FindAsync(request.TimeSlotId);
            if (timeSlot == null)
            {
                return NotFound();
            }
            if (timeSlot.AvailabilityStatus == "Busy")
            {
                return BadRequest();
            }
            else
            {
                timeSlot.AvailabilityStatus = request.AvailabilityStatus;
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("tickets/assign")]
        public async Task<IActionResult> AssignTicketToTimeSlots([FromBody] AssignTicketRequest request)
        {
            var timeSlots = await _context.TimeSlot
                .Where(ts => request.TimeSlotIds.Contains(ts.TimeSlotId))
                .ToListAsync();

            if (timeSlots.Count == 0)
            {
                return NotFound();
            }

            var ticket = await _context.Ticket.FindAsync(request.TicketId);
            if (ticket == null)
            {
                return NotFound();
            }

            foreach (var timeSlot in timeSlots)
            {
                timeSlot.AvailabilityStatus = "Busy";
                timeSlot.TicketId = request.TicketId;
            }

            ticket.State = "In Progress";
            ticket.EmployeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            string? employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FindAsync(employeeId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(new { id = user.Id });
        }


    }

    public class TimeSlotUpdateRequest
    {
        public int TimeSlotId { get; set; }
        public string AvailabilityStatus { get; set; }
    }

    public class AssignTicketRequest
    {
        public int TicketId { get; set; }
        public List<int> TimeSlotIds { get; set; }
    }
}
