using PetPulse.API.DTOs.Notification;
using System.Text;
using System.Text.Json;

namespace PetPulse.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(HttpClient httpClient, ILogger<NotificationService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> SendTelegramNotificationAsync(string telegramChatId, string templateName, Dictionary<string, string> parameters)
        {
            var requestPayload = new SendNotificationRequest
            {
                Channel = "TELEGRAM",
                Recipient = telegramChatId,
                TemplateName = templateName,
                Data = parameters
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(requestPayload, options);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                // POST /api/v1/notifications/send
                var response = await _httpClient.PostAsync("/api/v1/notifications/send", content);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Telegram notification sent successfully to {Recipient}", telegramChatId);
                    return true;
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to send notification. Status: {Status}. Error: {Error}", response.StatusCode, error);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error communicating with Notification Service");
                return false;
            }
        }
    }
}