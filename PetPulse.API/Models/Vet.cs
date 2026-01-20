using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.Models
{
    public class Vet
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public int YearsOfExperience { get; set; }

        // Navigation: One Vet has many appointments
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}