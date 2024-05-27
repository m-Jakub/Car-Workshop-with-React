using CarWorkshop.Server.Models;

namespace CarWorkshop.Server.ViewModels
{
    public class TicketManagementVM
    {
        public IEnumerable<Ticket>? Tickets { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalTickets { get; set; }
    }
}