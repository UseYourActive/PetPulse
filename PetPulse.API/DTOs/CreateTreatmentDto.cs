using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreateTreatmentDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0, 10000)] // Security: Prevent negative prices or absurdly high ones
        public decimal Cost { get; set; }
    }
}