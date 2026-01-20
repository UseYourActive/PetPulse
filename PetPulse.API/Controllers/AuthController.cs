using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PetPulse.API.Data;
using PetPulse.API.DTOs;
using PetPulse.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PetPulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            _logger.LogInformation("Register attempt for username: {Username}, Email: {Email}", model.Username, model.Email);

            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                return BadRequest("User already exists!");
            }

            // This ensures we don't create a User without an Owner profile if the second step fails.
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Create Identity User
                AppUser user = new()
                {
                    Email = model.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = model.Username
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                // 2. Assign Role
                await _userManager.AddToRoleAsync(user, UserRoles.User);

                // 3. Create Owner Profile
                var newOwner = new Owner
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber ?? "",
                    AppUserId = user.Id
                };

                _context.Owners.Add(newOwner);
                await _context.SaveChangesAsync();

                // Commit Transaction
                await transaction.CommitAsync();

                // 4. Generate Token & Return Response
                var authClaims = GetClaims(user, new List<string> { UserRoles.User });
                var token = GetToken(authClaims);

                return Ok(new AuthResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Username = user.UserName!,
                    Email = user.Email!,
                    Role = UserRoles.User,
                    OwnerId = newOwner.Id.ToString()
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Registration failed. Transaction rolled back.");
                return StatusCode(500, "Registration failed.");
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = GetClaims(user, userRoles);
                var token = GetToken(authClaims);

                // Safe Owner Retrieval
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == user.Id);

                // If I am Admin, 'owner' is null. Using owner!.AppUserId would CRASH the server.
                // We handle null by returning string.Empty or "0".
                var ownerId = owner?.Id.ToString() ?? string.Empty;

                return Ok(new AuthResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Username = user.UserName!,
                    Email = user.Email!,
                    Role = userRoles.FirstOrDefault() ?? "User",
                    OwnerId = ownerId // Return the Profile ID
                });
            }
            return Unauthorized();
        }

        // Helper to extract Claims logic
        private List<Claim> GetClaims(AppUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));
            return claims;
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key)) throw new Exception("JWT Key missing");

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            return new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
        }
    }
}