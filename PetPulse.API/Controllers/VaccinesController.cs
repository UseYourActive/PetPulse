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
    public class VaccinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public VaccinesController(ApplicationDbContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccineDto>>> GetVaccines([FromQuery] string? petId)
        {
            var query = _context.Vaccines.Include(v => v.Pet).ThenInclude(p => p.Owner).AsQueryable();

            // Security: Filter to User's Pets
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                if (owner != null)
                {
                    query = query.Where(v => v.Pet.OwnerId == owner.Id);
                }
            }

            if (!string.IsNullOrEmpty(petId) && Guid.TryParse(petId, out var pId))
            {
                query = query.Where(v => v.PetId == pId);
            }

            var vaccines = await query.ToListAsync();
            return Ok(_mapper.Map<List<VaccineDto>>(vaccines));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<VaccineDto>> AddVaccine(CreateVaccineDto dto)
        {
            if (!Guid.TryParse(dto.PetId, out var petId)) return BadRequest("Invalid Pet ID.");

            // Security Check
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);
                var pet = await _context.Pets.FindAsync(petId);

                if (owner == null || pet == null || pet.OwnerId != owner.Id)
                    return BadRequest("You can only add vaccines for your own pets.");
            }

            var vaccine = _mapper.Map<Vaccine>(dto);
            vaccine.Id = Guid.NewGuid();
            vaccine.PetId = petId;

            _context.Vaccines.Add(vaccine);
            await _context.SaveChangesAsync();

            await _context.Entry(vaccine).Reference(v => v.Pet).LoadAsync();

            return Ok(_mapper.Map<VaccineDto>(vaccine));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteVaccine(string id)
        {
            if (!Guid.TryParse(id, out var vId)) return BadRequest("Invalid ID.");
            var vaccine = await _context.Vaccines.Include(v => v.Pet).FirstOrDefaultAsync(v => v.Id == vId);
            if (vaccine == null) return NotFound();

            // Security Check
            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);
                if (owner != null && vaccine.Pet.OwnerId != owner.Id) return NotFound();
            }

            _context.Vaccines.Remove(vaccine);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}