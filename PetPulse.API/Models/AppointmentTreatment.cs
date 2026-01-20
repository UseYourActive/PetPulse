namespace PetPulse.API.Models
{
    public class AppointmentTreatment
    {
        // Composite Primary Key (defined in DbContext later)
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; } = null!;

        public Guid TreatmentId { get; set; }
        public Treatment Treatment { get; set; } = null!;
    }
}