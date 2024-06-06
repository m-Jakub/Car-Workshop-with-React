using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarWorkshop.Server.Models
{
    public class Ticket
    {

        public int TicketId { get; set; }

        [Required]
        public string Brand { get; set; }

        [Required]
        public string Model { get; set; }

        [Required]
        [Display(Name = "Registration ID")]
        public string RegistrationId { get; set; }

        [Required]
        public string Description { get; set; }

        public string? EmployeeId { get; set; }
        [ForeignKey("EmployeeId")]
        public AppUser? Employee { get; set; }

        [DisplayName("Assigned Employee")]
        public string? EmployeeName { get; set; } = "Not assigned";

        public List<int> TimeSlotIds { get; set; } = new List<int>();

        [Required]
        public string State { get; set; } = "Created";

        [DisplayName("Estimate Description")]
        public string? EstimateDescription { get; set; }

        [DisplayName("Expected Cost")]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? ExpectedCost { get; set; }

        [DisplayName("Estimate Accepted")]
        public bool? EstimateAccepted { get; set; } = false;

        public List<Part>? PartsBought { get; set; }

        [DisplayName("Price Paid")]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? PricePaid { get; set; }
    }

    public class Part
    {
        public int PartId { get; set; }
        public string Name { get; set; }
        public double Amount { get; set; }
        
        [DisplayName("Unit Price")]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }

        [DisplayName("Total Price")]
        public decimal TotalPrice => (decimal)Amount * UnitPrice;

        [Required]
        public int TicketId { get; set; }
    }
}
