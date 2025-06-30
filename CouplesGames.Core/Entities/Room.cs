namespace CouplesGames.Core.Entities
{
    public class Room
    {
        required public string Id { get; set; }
        required public string QuestionId { get; set; }
        public List<string> UserIds { get; set; } = new();
        public Dictionary<string, string> Answers { get; set; } = new(); // userId -> selectedOption
    }
}
