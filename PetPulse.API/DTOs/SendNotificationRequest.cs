using System.Text.Json.Serialization; // Required for [JsonPropertyName]

namespace PetPulse.API.DTOs.Notification
{
    public class SendNotificationRequest
    {
        [JsonPropertyName("channel")]
        public string Channel { get; set; } = "TELEGRAM";

        [JsonPropertyName("recipient")]
        public string Recipient { get; set; } = string.Empty;

        [JsonPropertyName("templateName")]
        public string TemplateName { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public Dictionary<string, string> Data { get; set; } = new Dictionary<string, string>();
    }
}