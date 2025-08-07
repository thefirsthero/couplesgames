namespace CouplesGames.Core.Configuration
{
    public class FirebaseSettings
    {
        public string ProjectId { get; set; } = string.Empty;
        public string ServiceAccountJsonBase64 { get; set; } = string.Empty;
    }

    public class FrontendSettings
    {
        public string Url { get; set; } = string.Empty;
        public string SecondaryUrl { get; set; } = string.Empty;
    }
}