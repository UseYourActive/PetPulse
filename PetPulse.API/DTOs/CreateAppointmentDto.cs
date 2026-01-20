using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreateAppointmentDto
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string PetId { get; set; } = string.Empty;

        [Required]
        public string VetId { get; set; } = string.Empty;
    }
}