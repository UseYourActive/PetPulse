using Microsoft.AspNetCore.Identity;

namespace PetPulse.API.Models
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
