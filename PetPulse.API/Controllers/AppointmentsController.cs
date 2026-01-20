using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetPulse.API.Data;
using PetPulse.API.DTOs;
using PetPulse.API.Enums;
using PetPulse.API.Models;
using PetPulse.API.Services;

namespace PetPulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<AppointmentsController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly INotificationService _notificationService;

        public AppointmentsController(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<AppointmentsController> logger,
            UserManager<AppUser> userManager,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
            _notificationService = notificationService;
        }

        // GET: api/appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortOrder = "date_desc",
            [FromQuery] DateTime? filterDate = null)
        {
            var query = _context.Appointments
                .Include(a => a.Vet)
                .Include(a => a.Pet)
                    .ThenInclude(p => p.Owner)
                .Include(a => a.AppointmentTreatments)
                    .ThenInclude(at => at.Treatment)
                .AsQueryable();

            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                if (username != null)
                {
                    var appUser = await _userManager.FindByNameAsync(username);
                    if (appUser != null)
                    {
                        var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser.Id);
                        if (owner != null)
                        {
                            query = query.Where(a => a.Pet.OwnerId == owner.Id);
                        }
                    }
                }
            }

            if (filterDate.HasValue)
            {
                query = query.Where(a => a.Date.Date == filterDate.Value.Date);
            }

            switch (sortOrder?.ToLower())
            {
                case "date_asc": query = query.OrderBy(a => a.Date); break;
                case "status": query = query.OrderBy(a => a.Status); break;
                case "date_desc": default: query = query.OrderByDescending(a => a.Date); break;
            }

            var appointments = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(_mapper.Map<List<AppointmentDto>>(appointments));
        }

        // GET: api/appointments/{id}
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

            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                if (owner != null && appointment.Pet.OwnerId != owner.Id)
                {
                    return NotFound();
                }
            }

            return Ok(_mapper.Map<AppointmentDto>(appointment));
        }

        // POST: api/appointments
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto dto)
        {
            if (!Guid.TryParse(dto.PetId, out var petId)) return BadRequest("Invalid Pet ID.");
            if (!Guid.TryParse(dto.VetId, out var vetId)) return BadRequest("Invalid Vet ID.");

            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var ownerCheck = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                var petCheck = await _context.Pets.FindAsync(petId);
                if (petCheck == null || ownerCheck == null || petCheck.OwnerId != ownerCheck.Id)
                {
                    return BadRequest("You can only book appointments for your own pets.");
                }
            }

            if (!await _context.Vets.AnyAsync(v => v.Id == vetId)) return BadRequest("Vet not found.");

            var appointment = _mapper.Map<Appointment>(dto);
            appointment.Id = Guid.NewGuid();
            appointment.PetId = petId;
            appointment.VetId = vetId;
            appointment.Status = AppointmentStatus.Scheduled;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            try
            {
                var pet = await _context.Pets.Include(p => p.Owner).FirstOrDefaultAsync(p => p.Id == petId);
                var vet = await _context.Vets.FindAsync(vetId);
                var owner = pet?.Owner;

                if (owner != null && vet != null && pet != null && !string.IsNullOrEmpty(owner.PhoneNumber))
                {
                    var notificationData = new Dictionary<string, string>
                    {
                        { "firstName", owner.FirstName },
                        { "taskCount", "1" },
                        { "messageCount", "0" },
                        { "nextEvent", $"Appointment for {pet.Name} with Dr. {vet.LastName} on {appointment.Date:MMM dd HH:mm} 🚀" }
                    };

                    _ = _notificationService.SendTelegramNotificationAsync(
                        owner.PhoneNumber,
                        "telegram/daily_reminder",
                        notificationData
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send Telegram notification.");
            }
            // ============================================================

            var fullAppointment = await _context.Appointments
                .Include(a => a.Vet)
                .Include(a => a.Pet).ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.Id == appointment.Id);

            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id.ToString() }, _mapper.Map<AppointmentDto>(fullAppointment));
        }

        // PUT: api/appointments/{id}/status
        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] AppointmentStatus newStatus)
        {
            if (!Guid.TryParse(id, out var appointmentId)) return BadRequest("Invalid ID format.");

            var appointment = await _context.Appointments.Include(a => a.Pet).FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null) return NotFound();

            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                if (owner != null && appointment.Pet.OwnerId != owner.Id) return NotFound();
            }

            appointment.Status = newStatus;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/appointments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAppointment(string id)
        {
            if (!Guid.TryParse(id, out var appointmentId)) return BadRequest("Invalid ID format.");

            var appointment = await _context.Appointments.Include(a => a.Pet).FirstOrDefaultAsync(a => a.Id == appointmentId);
            if (appointment == null) return NotFound();

            if (!User.IsInRole(UserRoles.Admin))
            {
                var username = User.Identity?.Name;
                var appUser = await _userManager.FindByNameAsync(username!);
                var owner = await _context.Owners.FirstOrDefaultAsync(o => o.AppUserId == appUser!.Id);

                if (owner != null && appointment.Pet.OwnerId != owner.Id) return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}