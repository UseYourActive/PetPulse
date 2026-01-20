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
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(ApplicationDbContext context, IMapper mapper, ILogger<ReviewsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/reviews?vetId=guid-string
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews([FromQuery] string? vetId)
        {
            var query = _context.Reviews.Include(r => r.Owner).AsQueryable();

            if (!string.IsNullOrEmpty(vetId))
            {
                if (!Guid.TryParse(vetId, out var vId)) return BadRequest("Invalid Vet ID format.");
                _logger.LogInformation("Fetching reviews filtered by VetId: {VetId}", vetId);
                query = query.Where(r => r.VetId == vId);
            }
            else
            {
                _logger.LogInformation("Fetching all reviews.");
            }

            var reviews = await query.OrderByDescending(r => r.DatePosted).ToListAsync();
            return Ok(_mapper.Map<List<ReviewDto>>(reviews));
        }

        // POST: api/reviews
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto dto)
        {
            // 1. Parse IDs from DTO
            if (!Guid.TryParse(dto.VetId, out var vetId)) return BadRequest("Invalid Vet ID.");
            if (!Guid.TryParse(dto.OwnerId, out var ownerId)) return BadRequest("Invalid Owner ID.");

            _logger.LogInformation("Creating review. Vet: {VetId}, Owner: {OwnerId}", vetId, ownerId);

            // 2. Validate Existence
            if (!await _context.Vets.AnyAsync(v => v.Id == vetId)) return BadRequest("Vet not found");
            if (!await _context.Owners.AnyAsync(o => o.Id == ownerId)) return BadRequest("Owner not found");

            // 3. Map & Save
            var review = _mapper.Map<Review>(dto);
            review.Id = Guid.NewGuid(); // Explicit GUID
            review.VetId = vetId;       // Explicit assignment
            review.OwnerId = ownerId;   // Explicit assignment
            review.DatePosted = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // 4. Reload for Owner Name
            await _context.Entry(review).Reference(r => r.Owner).LoadAsync();

            return Ok(_mapper.Map<ReviewDto>(review));
        }

        // GET: api/reviews/average/{guid}
        [HttpGet("average/{vetId}")]
        public async Task<ActionResult<double>> GetAverageRating(string vetId)
        {
            if (!Guid.TryParse(vetId, out var vId)) return BadRequest("Invalid Vet ID.");

            var ratings = await _context.Reviews
                .Where(r => r.VetId == vId)
                .Select(r => r.Rating)
                .ToListAsync();

            if (!ratings.Any()) return Ok(0.0);

            return Ok(ratings.Average());
        }
    }
}