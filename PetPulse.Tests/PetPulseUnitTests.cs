using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using PetPulse.API.Controllers;
using PetPulse.API.Data;
using PetPulse.API.DTOs;
using PetPulse.API.Models;
using PetPulse.API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using PetPulse.API.Enums;
using Moq.Protected;
using System.Net;
using PetPulse.API;
using Microsoft.Extensions.Logging;

namespace PetPulse.Tests
{
    public class PetPulseUnitTests
    {
        // Helper to create an In-Memory DB Context for each test
        private ApplicationDbContext GetInMemoryContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            return new ApplicationDbContext(options);
        }

        // Mock Mapper
        private IMapper GetMapper()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            return config.CreateMapper();
        }

        // Mock UserManager (Complex due to Identity framework)
        private Mock<UserManager<AppUser>> GetMockUserManager()
        {
            var store = new Mock<IUserStore<AppUser>>();
            return new Mock<UserManager<AppUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

        // Business logic and side effects
        [Fact]
        public async Task CreateAppointment_ShouldSaveAndSendNotification_WhenValid()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            using var context = GetInMemoryContext(dbName);
            var mapper = GetMapper();
            var mockNotification = new Mock<INotificationService>();
            var mockUserManager = GetMockUserManager();
            var mockLogger = new Mock<ILogger<AppointmentsController>>(); // Mock Logger

            // Setup Data
            var vetId = Guid.NewGuid();
            var petId = Guid.NewGuid();
            var ownerId = Guid.NewGuid();

            context.Vets.Add(new Vet { Id = vetId, FirstName = "House", LastName = "MD" });
            context.Pets.Add(new Pet
            {
                Id = petId,
                Name = "Scooby",
                Owner = new Owner
                {
                    Id = ownerId,
                    FirstName = "Shaggy",
                    PhoneNumber = "123456",
                    AppUserId = "user1"
                }
            });
            await context.SaveChangesAsync();

            // Setup Controller
            var controller = new AppointmentsController(context, mapper, mockLogger.Object, mockUserManager.Object, mockNotification.Object);

            // Mock User as Admin
            var claims = new List<Claim> { new Claim(ClaimTypes.Role, UserRoles.Admin) };
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims)) }
            };

            var dto = new CreateAppointmentDto
            {
                PetId = petId.ToString(),
                VetId = vetId.ToString(),
                Date = DateTime.UtcNow.AddDays(1),
                Description = "Checkup"
            };

            // Act
            var result = await controller.CreateAppointment(dto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var appointment = Assert.IsType<AppointmentDto>(createdResult.Value);

            // Verify DB persistence
            Assert.Equal(AppointmentStatus.Scheduled.ToString(), appointment.Status);

            // Verify Notification Service was called
            mockNotification.Verify(x => x.SendTelegramNotificationAsync(
                It.IsAny<string>(),
                "telegram/daily_reminder",
                It.IsAny<Dictionary<string, string>>()), Times.Once);
        }

        // Security and Data isolation
        [Fact]
        public async Task GetPets_ShouldFilterByOwner_WhenUserIsNotAdmin()
        {
            // Arrange
            var dbName = Guid.NewGuid().ToString();
            using var context = GetInMemoryContext(dbName);
            var mapper = GetMapper();
            var mockUserManager = GetMockUserManager();
            var mockLogger = new Mock<ILogger<PetsController>>();

            // Seed Data
            var user1Id = "user1-guid";
            var owner1Id = Guid.NewGuid();
            var owner2Id = Guid.NewGuid();

            context.Owners.AddRange(
                new Owner { Id = owner1Id, AppUserId = user1Id, FirstName = "Me", LastName = "Me", Email = "me@test.com", PhoneNumber = "1" },
                new Owner { Id = owner2Id, AppUserId = "other-guid", FirstName = "Other", LastName = "Person", Email = "other@test.com", PhoneNumber = "2" }
            );

            context.Pets.AddRange(
                new Pet { Id = Guid.NewGuid(), Name = "My Pet", OwnerId = owner1Id },
                new Pet { Id = Guid.NewGuid(), Name = "Other Pet", OwnerId = owner2Id }
            );
            await context.SaveChangesAsync();

            // Mock Logged in User
            var appUser = new AppUser { Id = user1Id, UserName = "myuser" };
            mockUserManager.Setup(x => x.FindByNameAsync("myuser")).ReturnsAsync(appUser);

            var controller = new PetsController(context, mapper, mockLogger.Object, mockUserManager.Object);

            // Set User Context
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, "myuser"),
                new Claim(ClaimTypes.Role, UserRoles.User)
            };
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth")) }
            };

            // Act
            var result = await controller.GetPets(null, null);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var pets = Assert.IsType<List<PetDto>>(actionResult.Value);

            Assert.Single(pets);
            Assert.Equal("My Pet", pets[0].Name);
        }

        // Data integrity
        [Fact]
        public async Task CreateReview_ShouldReturnBadRequest_WhenVetDoesNotExist()
        {
            // Arrange
            using var context = GetInMemoryContext(Guid.NewGuid().ToString());
            var mapper = GetMapper();

            var ownerId = Guid.NewGuid();
            context.Owners.Add(new Owner { Id = ownerId, FirstName = "John", LastName = "Doe", Email = "a@a.com", PhoneNumber = "1" });
            await context.SaveChangesAsync();

            var controller = new ReviewsController(context, mapper, new Mock<ILogger<ReviewsController>>().Object);

            var dto = new CreateReviewDto
            {
                VetId = Guid.NewGuid().ToString(),
                OwnerId = ownerId.ToString(),
                Rating = 5,
                Comment = "Great!"
            };

            // Act
            var result = await controller.CreateReview(dto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Vet not found", badRequest.Value);
        }

        // Service layer resiliency
        [Fact]
        public async Task SendNotification_ShouldReturnTrue_WhenHttpCallSucceeds()
        {
            // Arrange
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();

            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK
                });

            var httpClient = new HttpClient(mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("http://localhost:8080")
            };

            var service = new NotificationService(httpClient, new Mock<ILogger<NotificationService>>().Object);

            // Act
            var result = await service.SendTelegramNotificationAsync("12345", "welcome", new Dictionary<string, string>());

            // Assert
            Assert.True(result);
        }

        // Edge case handling
        [Fact]
        public async Task GetTreatment_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            // Arrange
            using var context = GetInMemoryContext(Guid.NewGuid().ToString());
            var mapper = GetMapper();
            var controller = new TreatmentsController(context, mapper, new Mock<ILogger<TreatmentsController>>().Object);

            // Act
            var result = await controller.GetTreatment("invalid-guid-string");

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Invalid ID.", badRequest.Value);
        }
    }
}