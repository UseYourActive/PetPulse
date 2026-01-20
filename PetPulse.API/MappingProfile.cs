using AutoMapper;
using PetPulse.API.DTOs;
using PetPulse.API.Models;

namespace PetPulse.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Owner Mapping
            CreateMap<Owner, OwnerDto>();
            CreateMap<CreateOwnerDto, Owner>();

            // Pet Mapping
            CreateMap<Pet, PetDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName));
            CreateMap<CreatePetDto, Pet>();

            // Vet Mapping
            CreateMap<CreateVetDto, Vet>();
            CreateMap<Vet, VetDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src =>
                        src.Reviews.Any() ? Math.Round(src.Reviews.Average(r => r.Rating), 1) : 0.0));

            // Treatment Mapping
            CreateMap<Treatment, TreatmentDto>();
            CreateMap<CreateTreatmentDto, Treatment>();

            // Appointment Mapping
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.PetName, opt => opt.MapFrom(src => src.Pet.Name))
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Pet.Owner.FirstName + " " + src.Pet.Owner.LastName))
                .ForMember(dest => dest.VetName, opt => opt.MapFrom(src => src.Vet.FirstName + " " + src.Vet.LastName))
                .ForMember(dest => dest.Treatments, opt => opt.MapFrom(src => src.AppointmentTreatments.Select(at => at.Treatment)));

            CreateMap<CreateAppointmentDto, Appointment>();

            // Review Mapping
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FirstName + " " + src.Owner.LastName));
            CreateMap<CreateReviewDto, Review>();

            CreateMap<Vaccine, VaccineDto>()
                .ForMember(dest => dest.PetName, opt => opt.MapFrom(src => src.Pet.Name));
            CreateMap<CreateVaccineDto, Vaccine>();
        }
    }
}