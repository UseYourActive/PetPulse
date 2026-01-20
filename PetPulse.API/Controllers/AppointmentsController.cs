using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetPulse.API.Data;
using PetPulse.API.DTOs;
using PetPulse.API.Enums;
using PetPulse.API.Models;

namespace PetPulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(ApplicationDbContext context,
            IMapper mapper,
            ILogger<AppointmentsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/appointments?page=1&pageSize=10&sortOrder=date_desc&filterDate=2023-10-01
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortOrder = "date_desc",
            [FromQuery] DateTime? filterDate = null)
        {
            _logger.LogInformation("Fetching appointments. Page: {Page}, Sort: {Sort}", page, sortOrder);

            var query = _context.Appointments
                .Include(a => a.Vet)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.Owner)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .AsQueryable();

            // 1. Filtering (Date)
            if (filterDate.HasValue)
            {
                // Compare just the Date part, ignoring time
                query = query.Where(a => a.Date.Date == filterDate.Value.Date);
            }

            // 2. Sorting
            switch (sortOrder?.ToLower())
            {
                case "date_asc":
                    query = query.OrderBy(a => a.Date);
                    break;
                case "status":
                    query = query.OrderBy(a => a.Status);
                    break;
                case "date_desc":
                default:
                    query = query.OrderByDescending(a => a.Date);
                    break;
            }

            // 3. Pagination
            var appointments = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(_mapper.Map<List<AppointmentDto>>(appointments));
        }

        // GET: api/appointments/{guid}
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointment(string id)
        {
            if (!Guid.TryParse(id, out var appointmentId)) return BadRequest("Invalid ID format.");

            var appointment = await _context.Appointments
                .Include(a => a.Vet)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.Owner)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null) return NotFound();

            return Ok(_mapper.Map<AppointmentDto>(appointment));
        }

        // POST: api/appointments
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto dto)
        {
            if (!Guid.TryParse(dto.PetId, out var petId)) return BadRequest("Invalid Pet ID.");
            if (!Guid.TryParse(dto.VetId, out var vetId)) return BadRequest("Invalid Vet ID.");

            // 1. Validate Relations
            if (!await _context.Pets.AnyAsync(p => p.Id == petId)) return BadRequest("Pet not found.");
            if (!await _context.Vets.AnyAsync(v => v.Id == vetId)) return BadRequest("Vet not found.");

            // 2. Map & Save
            var appointment = _mapper.Map<Appointment>(dto);
            appointment.Id = Guid.NewGuid(); // Explicit GUID
            appointment.PetId = petId;
            appointment.VetId = vetId;
            appointment.Status = AppointmentStatus.Scheduled;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // 3. Optimized Reload (Single Query instead of 3 explicit loads)
            var fullAppointment = await _context.Appointments
                .Include(a => a.Vet)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.Id == appointment.Id);

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id.ToString() }, _mapper.Map<AppointmentDto>(fullAppointment));
        }

        // PUT: api/appointments/{guid}/status
        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] AppointmentStatus newStatus)
        {
            if (!Guid.TryParse(id, out var appointmentId)) return BadRequest("Invalid ID format.");

            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return NotFound();

            appointment.Status = newStatus;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/appointments/{guid}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAppointment(string id)
        {
            if (!Guid.TryParse(id, out var appointmentId)) return BadRequest("Invalid ID format.");

            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return NotFound();

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}