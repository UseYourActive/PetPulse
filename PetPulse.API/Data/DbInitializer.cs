using Microsoft.AspNetCore.Identity;
using PetPulse.API.Enums;
using PetPulse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace PetPulse.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

                context.Database.EnsureCreated();

                if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

                if (!await roleManager.RoleExistsAsync(UserRoles.User))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.User));

                var adminEmail = "admin@petpulse.com";
                var adminUser = await userManager.FindByEmailAsync(adminEmail);
                if (adminUser == null)
                {
                    var newAdmin = new AppUser()
                    {
                        UserName = "admin",
                        Email = adminEmail,
                        SecurityStamp = Guid.NewGuid().ToString(),
                        EmailConfirmed = true,
                        FullName = "System Admin"
                    };

                    await userManager.CreateAsync(newAdmin, "Admin@123");
                    await userManager.AddToRoleAsync(newAdmin, UserRoles.Admin);
                }

                if (context.Owners.Any())
                {
                    return;
                }

                var vets = new List<Vet>()
                {
                    new Vet() { FirstName = "Gregory", LastName = "House", YearsOfExperience = 20 },
                    new Vet() { FirstName = "James", LastName = "Wilson", YearsOfExperience = 15 },
                    new Vet() { FirstName = "Lisa", LastName = "Cuddy", YearsOfExperience = 18 }
                };
                context.Vets.AddRange(vets);
                await context.SaveChangesAsync();

                var owners = new List<Owner>()
                {
                    new Owner()
                    {
                        FirstName = "John",
                        LastName = "Wick",
                        Email = "john@continental.com",
                        PhoneNumber = "1898155128",
                        Pets = new List<Pet>()
                        {
                            new Pet() { Name = "Daisy", Type = "Cat", Age = 1 }
                        }
                    },
                    new Owner()
                    {
                        FirstName = "Shaggy",
                        LastName = "Rogers",
                        Email = "shaggy@mystery.inc",
                        PhoneNumber = "1898155128",
                        Pets = new List<Pet>()
                        {
                            new Pet() { Name = "Scooby", Type = "Dog", Age = 7 }
                        }
                    }
                };
                context.Owners.AddRange(owners);
                await context.SaveChangesAsync();

                // 3.3 Create Treatments
                var vaccine = new Treatment() { Name = "Rabies Vaccine", Cost = 25.00m };
                var surgery = new Treatment() { Name = "General Surgery", Cost = 150.00m };
                var checkup = new Treatment() { Name = "General Checkup", Cost = 50.00m };

                context.Treatments.AddRange(vaccine, surgery, checkup);
                await context.SaveChangesAsync();

                var vetHouse = context.Vets.First(v => v.LastName == "House");
                var petScooby = context.Pets.First(p => p.Name == "Scooby");

                var appointments = new List<Appointment>()
                {
                    new Appointment()
                    {
                        Date = DateTime.UtcNow.AddDays(1), // Tomorrow
                        Description = "Excessive eating habits checkup",
                        Status = AppointmentStatus.Scheduled,
                        VetId = vetHouse.Id,
                        PetId = petScooby.Id,
                        
                        AppointmentTreatments = new List<AppointmentTreatment>()
                        {
                            new AppointmentTreatment { TreatmentId = checkup.Id }
                        }
                    },
                    new Appointment()
                    {
                        Date = DateTime.UtcNow.AddDays(-5), // 5 Days ago
                        Description = "Routine Vaccination",
                        Status = AppointmentStatus.Completed,
                        Diagnosis = "Healthy, gave treat.",
                        VetId = vetHouse.Id,
                        PetId = petScooby.Id,
                        
                        AppointmentTreatments = new List<AppointmentTreatment>()
                        {
                            new AppointmentTreatment { TreatmentId = vaccine.Id },
                            new AppointmentTreatment { TreatmentId = checkup.Id }
                        }
                    }
                };

                var petDaisy = context.Pets.First(p => p.Name == "Daisy");
                if (!context.Vaccines.Any())
                {
                    var vaccines = new List<Vaccine>
                    {
                        new Vaccine
                        {
                            Name = "Rabies",
                            DateAdministered = DateTime.UtcNow.AddMonths(-6),
                            ExpiryDate = DateTime.UtcNow.AddMonths(6),
                            PetId = petDaisy.Id
                        },
                        new Vaccine
                        {
                            Name = "Distemper",
                            DateAdministered = DateTime.UtcNow.AddMonths(-1),
                            ExpiryDate = DateTime.UtcNow.AddMonths(11),
                            PetId = petDaisy.Id
                        }
                     };
                    context.Vaccines.AddRange(vaccines);
                    await context.SaveChangesAsync();
                }

                context.Appointments.AddRange(appointments);
                await context.SaveChangesAsync();
            }
        }
    }
}