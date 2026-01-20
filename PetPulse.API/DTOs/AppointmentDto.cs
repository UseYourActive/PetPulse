using PetPulse.API.Enums;

namespace PetPulse.API.DTOs
{
    public class AppointmentDto
    {
        public string Id { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string PetName { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string VetName { get; set; } = string.Empty;
        public List<TreatmentDto> Treatments { get; set; } = new List<TreatmentDto>();
    }
}