using CarWorkshop.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CarWorkshop.Server.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Ticket> Ticket { get; set; }
        public DbSet<Part> Part { get; set; }
        public DbSet<TimeSlot> TimeSlot { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // relationship between Ticket and AppUser
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Employee)
                .WithMany()
                .HasForeignKey(t => t.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);

            // TimeSlot and AppUser
            modelBuilder.Entity<TimeSlot>()
                .HasOne(ts => ts.Employee)
                .WithMany()
                .HasForeignKey(ts => ts.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}