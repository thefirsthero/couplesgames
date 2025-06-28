namespace CouplesGamesApi.Core.Entities
{
    public class Question
    {
        required public string Id { get; set; }
        required public string OptionA { get; set; }
        required public string OptionB { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
