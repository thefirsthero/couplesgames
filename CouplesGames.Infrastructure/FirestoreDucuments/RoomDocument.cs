using Google.Cloud.Firestore;
using CouplesGames.Core.Entities;

namespace CouplesGames.Infrastructure.FirestoreDocuments
{
    [FirestoreData]
    public class RoomDocument
    {
        public RoomDocument() { }

        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty]
        public string GameMode { get; set; } = string.Empty;

        [FirestoreProperty]
        public string? QuestionId { get; set; }

        [FirestoreProperty]
        public List<string> UserIds { get; set; } = new();

        [FirestoreProperty]
        public Dictionary<string, string> Answers { get; set; } = new();

        [FirestoreProperty]
        public string? CurrentQuestion { get; set; }

        [FirestoreProperty]
        public string? AskingUserId { get; set; }

        [FirestoreProperty]
        public int RoundNumber { get; set; } = 1;

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Mapping functions
        public static RoomDocument FromDomain(Room room) => new RoomDocument
        {
            Id = room.Id,
            GameMode = room.GameMode,
            QuestionId = room.QuestionId,
            UserIds = room.UserIds,
            Answers = room.Answers,
            CurrentQuestion = room.CurrentQuestion,
            AskingUserId = room.AskingUserId,
            RoundNumber = room.RoundNumber,
            CreatedAt = room.CreatedAt
        };

        public Room ToDomain() => new Room
        {
            Id = this.Id,
            GameMode = this.GameMode,
            QuestionId = this.QuestionId,
            UserIds = this.UserIds,
            Answers = this.Answers,
            CurrentQuestion = this.CurrentQuestion,
            AskingUserId = this.AskingUserId,
            RoundNumber = this.RoundNumber,
            CreatedAt = this.CreatedAt
        };
    }
}
