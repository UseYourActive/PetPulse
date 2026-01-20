using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.Models
{
    public class Treatment
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g. "Rabies Vaccine"

        public decimal Cost { get; set; } // Money type

        // Navigation
        public ICollection<AppointmentTreatment> AppointmentTreatments { get; set; }
            = new List<AppointmentTreatment>();
    }
}