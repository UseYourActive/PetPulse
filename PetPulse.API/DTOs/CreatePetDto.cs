using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreatePetDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        [Range(0, 30)]
        public int Age { get; set; }

        [Required]
        public string OwnerId { get; set; } = string.Empty;
    }
}