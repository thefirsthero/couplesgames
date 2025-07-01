using Google.Cloud.Firestore;
using CouplesGames.Core.Entities;

namespace CouplesGames.Infrastructure.FirestoreDocuments
{
    [FirestoreData]
    public class QuestionDocument
    {
        public QuestionDocument() { }

        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty]
        public string OptionA { get; set; } = string.Empty;

        [FirestoreProperty]
        public string OptionB { get; set; } = string.Empty;

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Mapping functions
        public static QuestionDocument FromDomain(Question question) => new QuestionDocument
        {
            Id = question.Id,
            OptionA = question.OptionA,
            OptionB = question.OptionB,
            CreatedAt = question.CreatedAt
        };

        public Question ToDomain() => new Question
        {
            Id = this.Id,
            OptionA = this.OptionA,
            OptionB = this.OptionB,
            CreatedAt = this.CreatedAt
        };
    }
}
