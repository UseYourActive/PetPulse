using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetPulse.API.Models
{
    public class Owner
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        // Navigation Property: One Owner has many Pets
        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        // Link to the Login User (Identity)
        public string? AppUserId { get; set; }

        [ForeignKey("AppUserId")]
        public AppUser? AppUser { get; set; }
    }
}
