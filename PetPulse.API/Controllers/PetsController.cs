using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

        public PetsController(ApplicationDbContext context, IMapper mapper, ILogger<PetsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/pets?ownerId=...&search=daisy
        // Meets requirement: Filtering and Searching
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PetDto>>> GetPets(
            [FromQuery] string? ownerId,
            [FromQuery] string? search)
        {
            _logger.LogInformation("Fetching pets. Filter Owner: {OwnerId}, Search: {Search}", ownerId, search);

            var query = _context.Pets.Include(p => p.Owner).AsQueryable();

            // 1. Filter by Owner (Crucial for "My Pets" page)
            if (!string.IsNullOrEmpty(ownerId) && Guid.TryParse(ownerId, out var oId))
            {
                query = query.Where(p => p.OwnerId == oId);
            }

            // 2. Search by Name (Meets Search requirement)
            if (!string.IsNullOrEmpty(search))
            {
                // Case-insensitive search
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

            return Ok(_mapper.Map<PetDto>(pet));
        }

        // POST: api/pets
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PetDto>> CreatePet(CreatePetDto createPetDto)
        {
            // Validate Owner ID format
            if (!Guid.TryParse(createPetDto.OwnerId, out var ownerId))
                return BadRequest("Invalid Owner ID format.");

            // Check if Owner exists
            var ownerExists = await _context.Owners.AnyAsync(o => o.Id == ownerId);
            if (!ownerExists) return BadRequest("OwnerId does not exist.");

            var pet = _mapper.Map<Pet>(createPetDto);
            pet.Id = Guid.NewGuid(); // Explicitly create new ID
            pet.OwnerId = ownerId;   // Link to owner

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            // Load Owner for the return DTO
            await _context.Entry(pet).Reference(p => p.Owner).LoadAsync();

            return CreatedAtAction(nameof(GetPet), new { id = pet.Id.ToString() }, _mapper.Map<PetDto>(pet));
        }

        // PUT: api/pets/{guid}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePet(string id, [FromBody] CreatePetDto dto)
        {
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid ID.");

            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null) return NotFound();

            _mapper.Map(dto, pet);

            // Ensure OwnerId remains valid if it was changed
            if (Guid.TryParse(dto.OwnerId, out var newOwnerId))
            {
                pet.OwnerId = newOwnerId;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/pets/{guid}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePet(string id)
        {
            if (!Guid.TryParse(id, out var petId)) return BadRequest("Invalid ID.");

            var pet = await _context.Pets.FindAsync(petId);
            if (pet == null) return NotFound();

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}