using System.ComponentModel.DataAnnotations;

namespace CarWorkshop.Server.Models
{
    public class TimeSlot
    {
        public int TimeSlotId { get; set; }

        [Required]
        public string EmployeeId { get; set; }

        [Required]
        public DayOfWeek DayOfWeek { get; set; }

        [Required]
        public int Hour { get; set; }

        [Required]
        public string? AvailabilityStatus { get; set; }

        public AppUser? Employee { get; set; }

        public int? TicketId { get; set; }
    }
}
