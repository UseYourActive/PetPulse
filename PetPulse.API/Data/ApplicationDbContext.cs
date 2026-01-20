using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PetPulse.API.Models;

namespace PetPulse.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Owner> Owners { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Vet> Vets { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
        public DbSet<AppointmentTreatment> AppointmentTreatments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Vaccine> Vaccines { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure the One-to-Many relationship explicitly (optional but good practice)
            builder.Entity<Owner>()
                .HasMany(o => o.Pets)
                .WithOne(p => p.Owner)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Cascade); // If Owner is deleted, delete their Pets

            builder.Entity<AppointmentTreatment>()
                .HasKey(at => new { at.AppointmentId, at.TreatmentId });

            builder.Entity<AppointmentTreatment>()
                .HasOne(at => at.Appointment)
                .WithMany(a => a.AppointmentTreatments)
                .HasForeignKey(at => at.AppointmentId);

            builder.Entity<AppointmentTreatment>()
                .HasOne(at => at.Treatment)
                .WithMany(t => t.AppointmentTreatments)
                .HasForeignKey(at => at.TreatmentId);

            builder.Entity<Review>()
                .HasOne(r => r.Vet)
                .WithMany(v => v.Reviews)
                .HasForeignKey(r => r.VetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}