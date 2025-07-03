using Google.Cloud.Firestore;
using CouplesGames.Core.Entities;

namespace CouplesGames.Infrastructure.FirestoreDocuments
{
    [FirestoreData]
    public class PreviousRoundDataDocument
    {
        [FirestoreProperty]
        public string? Question { get; set; }

        [FirestoreProperty]
        public string? AskingUserId { get; set; }

        [FirestoreProperty]
        public Dictionary<string, string> Answers { get; set; } = new();

        public static PreviousRoundDataDocument FromDomain(PreviousRoundData domain) => new PreviousRoundDataDocument
        {
            Question = domain.Question,
            AskingUserId = domain.AskingUserId,
            Answers = domain.Answers
        };

        public PreviousRoundData ToDomain() => new PreviousRoundData
        {
            Question = this.Question,
            AskingUserId = this.AskingUserId,
            Answers = this.Answers
        };
    }
}
