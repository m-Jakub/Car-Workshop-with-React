using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using CarWorkshop.Server.Data;
using CarWorkshop.Server.Models;
using CarWorkshop.Server.ViewModels;

namespace CarWorkshop.Server.Controllers
{
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
        public async Task<ActionResult<Ticket>> CreateTicket(Ticket ticket)
        {
            _context.Ticket.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.TicketId }, ticket);
        }

        // PUT: api/Ticket/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, Ticket ticket)
        {
            if (id != ticket.TicketId)
            {
                return BadRequest();
            }

            if (!TicketExists(id))
            {
                return NotFound();
            }

            _context.Entry(ticket).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Ticket/5
        [HttpDelete("{id}")]
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

        private bool TicketExists(int id)
        {
            return _context.Ticket.Any(e => e.TicketId == id);
        }
    }
}