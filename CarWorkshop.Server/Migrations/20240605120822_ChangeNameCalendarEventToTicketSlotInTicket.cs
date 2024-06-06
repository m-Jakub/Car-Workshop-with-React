using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarWorkshop.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNameCalendarEventToTicketSlotInTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CalendarEventIds",
                table: "Ticket",
                newName: "TimeSlotIds");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TimeSlotIds",
                table: "Ticket",
                newName: "CalendarEventIds");
        }
    }
}
