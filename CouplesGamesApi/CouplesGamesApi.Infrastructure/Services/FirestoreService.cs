using CouplesGamesApi.Core.Entities;
using CouplesGamesApi.Core.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;

namespace CouplesGamesApi.Infrastructure.Services
{
    public class FirestoreService : IFirestoreService
    {
        private readonly FirestoreDb _db;

        public FirestoreService()
        {
            var json = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON");
            if (string.IsNullOrEmpty(json))
                throw new Exception("Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable.");

            var projectId = Environment.GetEnvironmentVariable("FIREBASE_PROJECT_ID");
            if (string.IsNullOrEmpty(projectId))
                throw new Exception("Missing FIREBASE_PROJECT_ID environment variable.");

            var credential = GoogleCredential.FromJson(json);
            var channelCredentials = credential.ToChannelCredentials();

            var clientBuilder = new FirestoreClientBuilder
            {
                ChannelCredentials = channelCredentials
            };

            var client = clientBuilder.Build();

            _db = FirestoreDb.Create(projectId, client);
        }

        public async Task<Room> CreateRoomAsync(Room room)
        {
            var docRef = _db.Collection("rooms").Document(room.Id);
            await docRef.SetAsync(room);
            return room;
        }

        public async Task<Room?> GetRoomAsync(string roomId)
        {
            var docRef = _db.Collection("rooms").Document(roomId);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<Room>() : null;
        }

        public async Task<Room> UpdateRoomAsync(Room room)
        {
            var docRef = _db.Collection("rooms").Document(room.Id);
            await docRef.SetAsync(room);
            return room;
        }

        public async Task<Question?> GetQuestionAsync(string questionId)
        {
            var docRef = _db.Collection("questions").Document(questionId);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<Question>() : null;
        }
    }
}
