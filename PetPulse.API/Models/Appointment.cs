using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PetPulse.API.Enums;

namespace PetPulse.API.Models
{
    public class Appointment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string? Description { get; set; } // Reason for visit

        public string? Diagnosis { get; set; } // Filled after the appointment

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

        // Relations
        public Guid PetId { get; set; }
        public Pet Pet { get; set; } = null!;

        public Guid VetId { get; set; }
        public Vet Vet { get; set; } = null!;

        public ICollection<AppointmentTreatment> AppointmentTreatments { get; set; } 
            = new List<AppointmentTreatment>();
    }
}
