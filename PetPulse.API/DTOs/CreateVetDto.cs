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

        [Required]
        public string Specialization { get; set; } = "General";

        [Range(0, 60)]
        public int YearsOfExperience { get; set; }
    }
}