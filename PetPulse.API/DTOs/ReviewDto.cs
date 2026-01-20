namespace PetPulse.API.DTOs
{
    public class ReviewDto
    {
        public string Id { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime DatePosted { get; set; }

        public string OwnerName { get; set; } = string.Empty;
        public string VetId { get; set; } = string.Empty;
    }
}