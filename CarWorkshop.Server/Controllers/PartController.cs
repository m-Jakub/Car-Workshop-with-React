using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarWorkshop.Server.Data;
using CarWorkshop.Server.Models;
using System.Linq;
using System.Threading.Tasks;

namespace CarWorkshop.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Part?ticketId=1
        [HttpGet]
        public async Task<IActionResult> GetParts(int ticketId)
        {
            var parts = await _context.Part
                .Where(p => p.TicketId == ticketId)
                .ToListAsync();

            if (parts == null)
            {
                return NotFound();
            }

            return Ok(parts);
        }


        // GET: api/Part/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Part>> GetPart(int id)
        {
            var part = await _context.Part.FindAsync(id);

            if (part == null)
            {
                return NotFound();
            }

            return part;
        }

        // POST: api/Part
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Part>> CreatePart(Part part)
        {
            _context.Part.Add(part);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPart), new { id = part.PartId }, part);
        }

        // PUT: api/Part/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePart(int id, Part part)
        {
            if (id != part.PartId)
            {
                return BadRequest("Part ID mismatch.");
            }

            var existingPart = await _context.Part.FindAsync(id);
            if (existingPart == null)
            {
                return NotFound("Part not found.");
            }

            existingPart.Name = part.Name;
            existingPart.Amount = part.Amount;
            existingPart.UnitPrice = part.UnitPrice;
            existingPart.TicketId = part.TicketId;

            _context.Entry(existingPart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PartExists(id))
                {
                    return NotFound("Part not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Part/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePart(int id)
        {
            var part = await _context.Part.FindAsync(id);
            if (part == null)
            {
                return NotFound();
            }

            _context.Part.Remove(part);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PartExists(int id)
        {
            return _context.Part.Any(e => e.PartId == id);
        }
    }
}
