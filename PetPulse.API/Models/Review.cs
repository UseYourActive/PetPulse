using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetPulse.API.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Range(1, 5)] // Validation: 1 to 5 stars
        public int Rating { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; } = string.Empty;

        public DateTime DatePosted { get; set; } = DateTime.UtcNow;

        // Relations
        public Guid VetId { get; set; }
        public Vet Vet { get; set; } = null!;

        public Guid OwnerId { get; set; }
        public Owner Owner { get; set; } = null!;
    }
}