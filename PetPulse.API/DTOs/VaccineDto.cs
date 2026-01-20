namespace PetPulse.API.DTOs
{
    public class VaccineDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime DateAdministered { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string PetName { get; set; } = string.Empty;
    }
}