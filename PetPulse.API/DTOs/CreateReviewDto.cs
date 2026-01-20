using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreateReviewDto
    {
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; } = string.Empty;

        [Required]
        public string VetId { get; set; } = string.Empty;

        [Required]
        public string OwnerId { get; set; } = string.Empty;
    }
}