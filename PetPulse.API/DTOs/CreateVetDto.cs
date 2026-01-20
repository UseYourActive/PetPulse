using System.ComponentModel.DataAnnotations;

namespace PetPulse.API.DTOs
{
    public class CreateVetDto
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Range(0, 60)]
        public int YearsOfExperience { get; set; }
    }
}