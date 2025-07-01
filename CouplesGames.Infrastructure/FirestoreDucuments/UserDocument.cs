using Google.Cloud.Firestore;
using CouplesGames.Core.Entities;

namespace CouplesGames.Infrastructure.FirestoreDocuments
{
    [FirestoreData]
    public class UserDocument
    {
        public UserDocument() { }

        [FirestoreProperty]
        public string Uid { get; set; } = string.Empty;

        [FirestoreProperty]
        public string DisplayName { get; set; } = string.Empty;

        // Mapping functions
        public static UserDocument FromDomain(User user) => new UserDocument
        {
            Uid = user.Uid,
            DisplayName = user.DisplayName
        };

        public User ToDomain() => new User
        {
            Uid = this.Uid,
            DisplayName = this.DisplayName
        };
    }
}
