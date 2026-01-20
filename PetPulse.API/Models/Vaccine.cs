using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetPulse.API.Models
{
    public class Vaccine
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g. "Rabies"

        public DateTime DateAdministered { get; set; }
        public DateTime? ExpiryDate { get; set; }

        // Relation to Pet
        public Guid PetId { get; set; }
        [ForeignKey("PetId")]
        public Pet Pet { get; set; } = null!;
    }
}