using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreateVaccineDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public DateTime DateAdministered { get; set; }
        public DateTime? ExpiryDate { get; set; }
        [Required]
        public string PetId { get; set; } = string.Empty;
    }
}