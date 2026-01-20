namespace PetPulse.API.Models
{
    public class AppointmentTreatment
    {
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public Guid TreatmentId { get; set; }
        public Treatment Treatment { get; set; } = null!;
    }
}