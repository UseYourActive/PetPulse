using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetPulse.API.Data;
using PetPulse.API.DTOs;
using PetPulse.API.Models;

namespace PetPulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<PetsController> _logger;
        private readonly UserManager<AppUser> _userManager;

        public PetsController(ApplicationDbContext context, IMapper mapper, ILogger<PetsController> logger, UserManager<AppUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
        }

        // GET: api/pets?ownerId=...&search=daisy
        // Meets requirement: Filtering and Searching
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPets(
            [FromQuery] string? ownerId,
            [FromQuery] string? search)
        {
            var query = _context.Pets.Include(p => p.Owner).AsQueryable();

            // 1. SECURITY FILTER: Identify the user
            // If the user is NOT an Admin, we MUST force the filter to their own OwnerId.
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                if (username != null)
                {
                    // Find the AppUser, then find the connected Owner profile
                    var appUser = await _userManager.FindByNameAsync(username);
                    if (appUser != null)
                    {
                        var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser.Id);
                        if (owner != null)
                        {
                            // FORCE the filter: User can ONLY see their own pets
                            query = query.Where(p => p.OwnerId == owner.Id);
                        }
                    }
                }
            }
            else
            {
                // If Admin, allow manual filtering via the query parameter
                if (!string.IsNullOrEmpty(ownerId) && Guid.TryParse(ownerId, out var oId))
                {
                    query = query.Where(p => p.OwnerId == oId);
                }
            }

            // 2. Search Logic
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
            }

            var pets = await query.ToListAsync();
            return Ok(_mapper.Map<List<PetDto>>(pets));
        }

        // GET: api/pets/{guid}
        [HttpGet("{id}")]
        public async Task<ActionResult<PetDto>> GetPet(string id)
        {
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid ID.");

            var pet = await _context.Pets
                                    .Include(p => p.Owner)
                                    .FirstOrDefaultAsync(p => p.Id == petId);

            if (pet == null) return NotFound();

            // SECURITY CHECK: If standard user, prevent accessing someone else's pet via direct ID
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                if (username != null)
                {
                    var appUser = await _userManager.FindByNameAsync(username);
                    if (appUser != null)
                    {
                        var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser.Id);
                        // If the pet doesn't belong to the logged-in owner, return Not Found (or Forbidden)
                        if (owner != null && pet.OwnerId != owner.Id)
                        {
                            return NotFound(); // Hide existence of other pets
                        }
                    }
                }
            }

            return Ok(_mapper.Map<PetDto>(pet));
        }

        // POST: api/pets
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PetDto>> CreatePet(CreatePetDto createPetDto)
        {
            if (!Guid.TryParse(createPetDto.OwnerId, out var ownerId))
                return BadRequest("Invalid Owner ID format.");

            // Security: Ensure User isn't creating a pet for someone else
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                if (owner == null || owner.Id != ownerId)
                {
                    return BadRequest("You can only create pets for yourself.");
                }
            }

            var ownerExists = await _context.Owners.AnyAsync(o => o.Id == ownerId);
            if (!ownerExists) return BadRequest("OwnerId does not exist.");

            var pet = _mapper.Map<Pet>(createPetDto);
            pet.Id = Guid.NewGuid();
            pet.OwnerId = ownerId;

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            await _context.Entry(pet).Reference(p => p.Owner).LoadAsync();

            return CreatedAtAction(nameof(GetPet), new { id = pet.Id.ToString() }, _mapper.Map<PetDto>(pet));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePet(string id, [FromBody] CreatePetDto dto)
        {
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid ID.");
            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null) return NotFound();

            // Security Check
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);
                if (owner != null && pet.OwnerId != owner.Id) return Forbid();
            }

            _mapper.Map(dto, pet);
            if (Guid.TryParse(dto.OwnerId, out var newOwnerId)) pet.OwnerId = newOwnerId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePet(string id)
        {
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid ID.");
            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null) return NotFound();

            // Security Check
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);
                if (owner != null && pet.OwnerId != owner.Id) return Forbid();
            }

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/pets/{id}/appointments
        // Returns the full appointment history for a specific pet
        [HttpGet("{id}/appointments")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetPetAppointments(string id)
        {
            // 1. Validate ID format
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid Pet ID format.");

            // 2. Check if Pet exists
            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null) return NotFound("Pet not found.");

            // 3. SECURITY: Ensure the user owns this pet (or is Admin)
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                // If user doesn't own the pet, block access
                if (owner == null || pet.OwnerId != owner.Id)
                {
                    return NotFound(); // Hide existence of the pet
                }
            }

            // 4. Fetch History
            // We Include Vet and Treatments to show full details (who did it, what was done)
            var appointments = await _context.Appointments
                .Where(a => a.PetId == petId)
                .Include(a => a.Vet)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .OrderByDescending(a => a.Date) // Sort by newest first (History style)
                .ToListAsync();

            return Ok(_mapper.Map<List<AppointmentDto>>(appointments));
        }
    }
}