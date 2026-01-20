using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class AddTreatmentDto
    {
        [Required]
        public string TreatmentId { get; set; } = string.Empty;
    }
}