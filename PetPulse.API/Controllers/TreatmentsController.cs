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
    public class TreatmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<TreatmentsController> _logger;

        public TreatmentsController(ApplicationDbContext context, IMapper mapper, ILogger<TreatmentsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TreatmentDto>>> GetTreatments()
        {
            var treatments = await _context.Treatments.ToListAsync();
            return Ok(_mapper.Map<List<TreatmentDto>>(treatments));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TreatmentDto>> GetTreatment(string id)
        {
            if (!Guid.TryParse(id, out var tId)) return BadRequest("Invalid ID.");

            var treatment = await _context.Treatments.FindAsync(tId);
            if (treatment == null) return NotFound();

            return Ok(_mapper.Map<TreatmentDto>(treatment));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TreatmentDto>> CreateTreatment(CreateTreatmentDto dto)
        {
            var treatment = _mapper.Map<Treatment>(dto);
            treatment.Id = Guid.NewGuid();

            _context.Treatments.Add(treatment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTreatment), new { id = treatment.Id.ToString() }, _mapper.Map<TreatmentDto>(treatment));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTreatment(string id, CreateTreatmentDto dto)
        {
            if (!Guid.TryParse(id, out var tId)) return BadRequest("Invalid ID.");

            var treatment = await _context.Treatments.FindAsync(tId);
            if (treatment == null) return NotFound();

            _mapper.Map(dto, treatment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTreatment(string id)
        {
            if (!Guid.TryParse(id, out var tId)) return BadRequest("Invalid ID.");

            var treatment = await _context.Treatments.FindAsync(tId);
            if (treatment == null) return NotFound();

            try
            {
                _context.Treatments.Remove(treatment);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Cannot delete treatment; it is attached to existing appointments.");
            }

            return NoContent();
        }

        // POST: api/treatments/{appointmentId}/treatments
        [HttpPost("{id}/treatments")]
        [Authorize]
        public async Task<IActionResult> AddTreatment(string id, [FromBody] AddTreatmentDto dto)
        {
            // 1. Parse IDs
            if (!Guid.TryParse(id, out var appId)) return BadRequest("Invalid Appointment ID.");
            if (!Guid.TryParse(dto.TreatmentId, out var treatmentId)) return BadRequest("Invalid Treatment ID.");

            // 2. Find Appointment
            var appointment = await _context.Appointments
                .Include(a => a.AppointmentTreatments)
                .FirstOrDefaultAsync(a => a.Id == appId);

            if (appointment == null) return NotFound("Appointment not found.");

            // 3. Find Treatment
            var treatment = await _context.Treatments.FindAsync(treatmentId);
            if (treatment == null) return BadRequest("Treatment not found.");

            // 4. Check Duplicates
            if (appointment.AppointmentTreatments.Any(at => at.TreatmentId == treatmentId))
            {
                return Conflict("Treatment already added to this appointment.");
            }

            // 5. Link
            var link = new AppointmentTreatment
            {
                AppointmentId = appId,
                TreatmentId = treatmentId
            };
            _context.AppointmentTreatments.Add(link);
            await _context.SaveChangesAsync();

            return Ok("Treatment added.");
        }

        // DELETE: api/treatments/{appointmentId}/treatments/{treatmentId}
        [Authorize]
        [HttpDelete("{id}/treatments/{treatmentId}")]
        public async Task<IActionResult> RemoveTreatment(string id, string treatmentId)
        {
            if (!Guid.TryParse(id, out var appId)) return BadRequest("Invalid Appointment ID.");
            if (!Guid.TryParse(treatmentId, out var tId)) return BadRequest("Invalid Treatment ID.");

            var link = await _context.AppointmentTreatments
                .FirstOrDefaultAsync(at => at.AppointmentId == appId && at.TreatmentId == tId);

            if (link == null) return NotFound("Treatment not found on this appointment.");

            _context.AppointmentTreatments.Remove(link);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}