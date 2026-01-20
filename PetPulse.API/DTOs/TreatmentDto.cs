namespace PetPulse.API.DTOs
{
    public class TreatmentDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
    }
}