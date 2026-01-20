using PetPulse.API.DTOs.Notification;

namespace PetPulse.API.Services
{
    public interface INotificationService
    {
        Task<bool> SendTelegramNotificationAsync(string telegramChatId, string templateName, Dictionary<string, string> parameters);
    }
}