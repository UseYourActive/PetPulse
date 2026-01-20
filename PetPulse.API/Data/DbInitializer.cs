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

                // 1. Ensure Database Exists
                context.Database.EnsureCreated();

                // ==============================
                // 2. SEED ROLES & ADMIN USER
                // ==============================

                if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

                if (!await roleManager.RoleExistsAsync(UserRoles.User))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.User));

                // Seed Default Admin User
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

                // ==============================
                // 3. SEED BUSINESS DATA
                // ==============================

                // If owners exist, we assume data is already seeded
                if (context.Owners.Any())
                {
                    return;
                }

                // 3.1 Create Vets (Removed Specialization)
                var vets = new List<Vet>()
                {
                    new Vet() { FirstName = "Gregory", LastName = "House", YearsOfExperience = 20 },
                    new Vet() { FirstName = "James", LastName = "Wilson", YearsOfExperience = 15 },
                    new Vet() { FirstName = "Lisa", LastName = "Cuddy", YearsOfExperience = 18 }
                };
                context.Vets.AddRange(vets);
                await context.SaveChangesAsync(); // Save to generate GUIDs

                // 3.2 Create Owners & Pets
                var owners = new List<Owner>()
                {
                    new Owner()
                    {
                        FirstName = "John",
                        LastName = "Wick",
                        Email = "john@continental.com",
                        PhoneNumber = "555-0100",
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
                        PhoneNumber = "555-0200",
                        Pets = new List<Pet>()
                        {
                            new Pet() { Name = "Scooby", Type = "Dog", Age = 7 }
                        }
                    }
                };
                context.Owners.AddRange(owners);
                await context.SaveChangesAsync(); // Save to generate GUIDs

                // 3.3 Create Treatments
                var vaccine = new Treatment() { Name = "Rabies Vaccine", Cost = 25.00m };
                var surgery = new Treatment() { Name = "General Surgery", Cost = 150.00m };
                var checkup = new Treatment() { Name = "General Checkup", Cost = 50.00m };

                context.Treatments.AddRange(vaccine, surgery, checkup);
                await context.SaveChangesAsync(); // Save to generate GUIDs

                // 3.4 Create Appointments (Link via retrieved GUIDs)
                var vetHouse = context.Vets.First(v => v.LastName == "House");
                var petScooby = context.Pets.First(p => p.Name == "Scooby");

                var appointments = new List<Appointment>()
                {
                    new Appointment()
                    {
                        Date = DateTime.UtcNow.AddDays(1), // Tomorrow
                        Description = "Excessive eating habits checkup",
                        Status = AppointmentStatus.Scheduled,
                        VetId = vetHouse.Id, // Valid GUID
                        PetId = petScooby.Id, // Valid GUID
                        
                        // Link Treatments
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
                        VetId = vetHouse.Id, // Valid GUID
                        PetId = petScooby.Id, // Valid GUID
                        
                        AppointmentTreatments = new List<AppointmentTreatment>()
                        {
                            new AppointmentTreatment { TreatmentId = vaccine.Id },
                            new AppointmentTreatment { TreatmentId = checkup.Id }
                        }
                    }
                };

                context.Appointments.AddRange(appointments);
                await context.SaveChangesAsync();
            }
        }
    }
}