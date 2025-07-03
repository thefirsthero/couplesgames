namespace CouplesGames.Core.Entities
{
    public class Room
    {
        required public string Id { get; set; }
        required public string GameMode { get; set; } // "existing_questions" or "ask_each_other"

        public string? QuestionId { get; set; } // For existing questions mode

        public List<string> UserIds { get; set; } = new();

        public Dictionary<string, string> Answers { get; set; } = new(); // userId -> selectedOption

        public string? CurrentQuestion { get; set; } // For ask each other mode
        public string? AskingUserId { get; set; } // Who is currently asking

        public int RoundNumber { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public PreviousRoundData? PreviousRound { get; set; }
    }

    public class PreviousRoundData
    {
        public string? Question { get; set; }
        public string? AskingUserId { get; set; }
        public Dictionary<string, string> Answers { get; set; } = new();
    }
}
