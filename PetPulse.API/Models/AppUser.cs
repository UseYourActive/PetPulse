using Microsoft.AspNetCore.Identity;

namespace PetPulse.API.Models
{
    // Extends the built-in IdentityUser to add custom fields if needed
    public class AppUser : IdentityUser
    {
        // Example: You might want to store the Full Name directly on the user account
        public string? FullName { get; set; }
    }
}
