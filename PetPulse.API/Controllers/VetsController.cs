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
    public class VetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<VetsController> _logger;

        public VetsController(ApplicationDbContext context, IMapper mapper, ILogger<VetsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VetDto>>> GetVets()
        {
            _logger.LogInformation("Fetching all vets from database...");

            var vets = await _context.Vets
                .Include(v => v.Reviews)
                .ToListAsync();

            _logger.LogInformation("Successfully retrieved {Count} vets.", vets.Count);
            return Ok(_mapper.Map<List<VetDto>>(vets));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VetDto>> GetVet(string id)
        {
            if (!Guid.TryParse(id, out var vId)) return BadRequest("Invalid ID.");

            var vet = await _context.Vets
                .Include(v => v.Reviews)
                .FirstOrDefaultAsync(v => v.Id == vId);

            if (vet == null)
            {
                _logger.LogWarning("Vet with ID {Id} not found.", id);
                return NotFound();
            }

            return Ok(_mapper.Map<VetDto>(vet));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<VetDto>> CreateVet(CreateVetDto createVetDto)
        {
            var vet = _mapper.Map<Vet>(createVetDto);
            vet.Id = Guid.NewGuid();

            _context.Vets.Add(vet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVet), new { id = vet.Id.ToString() }, _mapper.Map<VetDto>(vet));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateVet(string id, CreateVetDto updateVetDto)
        {
            if (!Guid.TryParse(id, out var vId)) return BadRequest("Invalid ID.");

            var vet = await _context.Vets.FindAsync(vId);
            if (vet == null) return NotFound();

            _mapper.Map(updateVetDto, vet);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVet(string id)
        {
            if (!Guid.TryParse(id, out var vId)) return BadRequest("Invalid ID.");

            var vet = await _context.Vets.FindAsync(vId);
            if (vet == null) return NotFound();

            _context.Vets.Remove(vet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}