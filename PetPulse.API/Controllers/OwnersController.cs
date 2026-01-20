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
    public class OwnersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<OwnersController> _logger;

        public OwnersController(ApplicationDbContext context, IMapper mapper, ILogger<OwnersController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/owners
        [HttpGet]
        [Authorize(Roles = "Admin")] // Only Admin should see a list of ALL users
        public async Task<ActionResult<IEnumerable<OwnerDto>>> GetOwners()
        {
            _logger.LogInformation("Fetching all owners from database...");
            var owners = await _context.Owners.ToListAsync();
            return Ok(_mapper.Map<List<OwnerDto>>(owners));
        }

        // GET: api/owners/{guid}
        [HttpGet("{id}")]
        [Authorize] // Any logged in user
        public async Task<ActionResult<OwnerDto>> GetOwner(string id)
        {
            if (!Guid.TryParse(id, out var ownerId)) return BadRequest("Invalid ID format.");

            _logger.LogInformation("Fetching details for Owner ID: {Id}", id);

            var owner = await _context.Owners.FindAsync(ownerId);
            if (owner == null) return NotFound();

            return Ok(_mapper.Map<OwnerDto>(owner));
        }

        // POST: api/owners
        // NOTE: This is rarely used directly because Register() creates the owner.
        // But we keep it for Admin purposes or manual creation.
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OwnerDto>> CreateOwner(CreateOwnerDto createOwnerDto)
        {
            var owner = _mapper.Map<Owner>(createOwnerDto);
            // Since we use Guids, EF Core usually generates them, but we can be explicit:
            owner.Id = Guid.NewGuid();

            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOwner), new { id = owner.Id.ToString() }, _mapper.Map<OwnerDto>(owner));
        }

        // PUT: api/owners/{guid}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateOwner(string id, [FromBody] CreateOwnerDto dto)
        {
            if (!Guid.TryParse(id, out var ownerId)) return BadRequest("Invalid ID format.");

            var owner = await _context.Owners.FindAsync(ownerId);
            if (owner == null) return NotFound();

            // Map new values onto existing entity
            _mapper.Map(dto, owner);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Owners.Any(o => o.Id == ownerId)) return NotFound();
                else throw;
            }

            return NoContent(); // 204 Success
        }

        // DELETE: api/owners/{guid}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Critical: Only Admin should delete users this way
        public async Task<IActionResult> DeleteOwner(string id)
        {
            if (!Guid.TryParse(id, out var ownerId)) return BadRequest("Invalid ID format.");

            var owner = await _context.Owners.FindAsync(ownerId);
            if (owner == null) return NotFound();

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}