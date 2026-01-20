using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetPulse.API.Models
{
    public class Pet
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public int Age { get; set; }

        // Navigation Property: One Pet belongs to One Owner
        public Guid OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public Owner Owner { get; set; } = null!;
    }
}
