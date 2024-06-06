using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using CarWorkshop.Server.Data;
using CarWorkshop.Server.Models;
using CarWorkshop.Server.ViewModels;

namespace CarWorkshop.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Ticket
        [HttpGet]
        public async Task<ActionResult<TicketManagementVM>> GetTickets(int page = 1, int pageSize = 10)
        {
            int totalTickets = await _context.Ticket.CountAsync();
            var tickets = await _context.Ticket
                .Include(t => t.Employee)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var ticketVMs = tickets.Select(ticket => new Ticket
            {
                TicketId = ticket.TicketId,
                Brand = ticket.Brand,
                Model = ticket.Model,
                RegistrationId = ticket.RegistrationId,
                Description = ticket.Description,
                EmployeeName = ticket.Employee?.UserName ?? "Not assigned",
                State = ticket.State,
                EstimateDescription = ticket.EstimateDescription,
                ExpectedCost = ticket.ExpectedCost,
                EstimateAccepted = ticket.EstimateAccepted,
                PricePaid = ticket.PricePaid
            }).ToList();

            return new TicketManagementVM
            {
                Tickets = ticketVMs,
                Page = page,
                PageSize = pageSize,
                TotalTickets = totalTickets
            };
        }

        // GET: api/Ticket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        // POST: api/Ticket
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Ticket>> CreateTicket(Ticket ticket)
        {
            _context.Ticket.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.TicketId }, ticket);
        }

        // PUT: api/Ticket/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTicket(int id, Ticket ticket)
        {
            if (id != ticket.TicketId)
            {
                return BadRequest("Ticket ID mismatch.");
            }

            var existingTicket = await _context.Ticket.FindAsync(id);
            if (existingTicket == null)
            {
                return NotFound("Ticket not found.");
            }

            existingTicket.Brand = ticket.Brand;
            existingTicket.Model = ticket.Model;
            existingTicket.RegistrationId = ticket.RegistrationId;
            existingTicket.Description = ticket.Description;
            existingTicket.State = ticket.State;
            existingTicket.EstimateDescription = ticket.EstimateDescription;
            existingTicket.ExpectedCost = ticket.ExpectedCost;
            existingTicket.EstimateAccepted = ticket.EstimateAccepted;
            existingTicket.PricePaid = ticket.PricePaid;

            _context.Entry(existingTicket).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/Ticket/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Ticket.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Ticket.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("accept/{ticketId}")]
        [Authorize(Roles = "Employee")]
        public async Task<IActionResult> AcceptTicket(int ticketId, [FromBody] AcceptTicketModel model)
        {
            var ticket = await _context.Ticket.FindAsync(ticketId);
            if (ticket == null)
            {
                return NotFound(new { success = false, message = "Ticket not found" });
            }

            ticket.EmployeeId = model.EmployeeId;
            ticket.State = "In Progress";
            ticket.EmployeeName = User.Identity.Name;

            if (model.TimeSlotIds != null && model.TimeSlotIds.Any())
            {
                ticket.TimeSlotIds = model.TimeSlotIds;
                foreach (var timeSlotId in model.TimeSlotIds)
                {
                    var timeSlot = await _context.TimeSlot.FindAsync(timeSlotId);
                    if (timeSlot != null)
                    {
                        timeSlot.AvailabilityStatus = "Busy";
                        timeSlot.TicketId = ticketId;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.TicketId == id);
        }
    }

    public class AcceptTicketModel
    {
        public string EmployeeId { get; set; }
        public List<int> TimeSlotIds { get; set; }
    }
}
