using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.FirestoreDocuments;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;

namespace CouplesGames.Infrastructure.Services
{
    public class FirestoreService : IFirestoreService
    {
        private readonly FirestoreDb _db;

        public FirestoreService()
        {
            var jsonBase64 = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON_BASE64");
            if (string.IsNullOrEmpty(jsonBase64))
                throw new Exception("Missing FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.");

            var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(jsonBase64));

            if (string.IsNullOrEmpty(json))
                throw new Exception("Invalid FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.");

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

        public async Task LogErrorAsync(string context, Exception ex)
        {
            try
            {
                var errorRef = _db.Collection("errors").Document();
                var errorData = new Dictionary<string, object>
                {
                    { "context", context },
                    { "message", ex.Message },
                    { "stackTrace", ex.StackTrace ?? "" },
                    { "time", DateTime.UtcNow }
                };
                await errorRef.SetAsync(errorData);
            }
            catch
            {
                // Avoid recursive logging errors
            }
        }

        public async Task<Room> CreateRoomAsync(Room room)
        {
            try
            {
                var docRef = _db.Collection("rooms").Document(room.Id);
                var roomDoc = RoomDocument.FromDomain(room);
                await docRef.SetAsync(roomDoc);
                return room;
            }
            catch (Exception ex)
            {
                await LogErrorAsync("CreateRoomAsync", ex);
                throw;
            }
        }

        public async Task<Room?> GetRoomAsync(string roomId)
        {
            try
            {
                var docRef = _db.Collection("rooms").Document(roomId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                    return null;

                var roomDoc = snapshot.ConvertTo<RoomDocument>();
                return roomDoc.ToDomain();
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetRoomAsync", ex);
                throw;
            }
        }

        public async Task<Room> UpdateRoomAsync(Room room)
        {
            try
            {
                var docRef = _db.Collection("rooms").Document(room.Id);
                var roomDoc = RoomDocument.FromDomain(room);
                await docRef.SetAsync(roomDoc);
                return room;
            }
            catch (Exception ex)
            {
                await LogErrorAsync("UpdateRoomAsync", ex);
                throw;
            }
        }

        public async Task<Question?> GetQuestionAsync(string questionId)
        {
            try
            {
                var docRef = _db.Collection("questions").Document(questionId);
                var snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                    return null;

                var questionDoc = snapshot.ConvertTo<QuestionDocument>();
                return questionDoc.ToDomain();
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetQuestionAsync", ex);
                throw;
            }
        }

        public async Task<User?> GetUserAsync(string userId)
        {
            try
            {
                var docRef = _db.Collection("users").Document(userId);
                var snapshot = await docRef.GetSnapshotAsync();
                if (!snapshot.Exists)
                    return null;
                var userDoc = snapshot.ConvertTo<UserDocument>();
                return userDoc.ToDomain();
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetUserAsync", ex);
                throw;
            }
        }

        public async Task<List<Room>> GetAllRoomsAsync()
        {
            try
            {
                var snapshot = await _db.Collection("rooms").GetSnapshotAsync();
                var rooms = new List<Room>();

                foreach (var doc in snapshot.Documents)
                {
                    var roomDoc = doc.ConvertTo<RoomDocument>();
                    rooms.Add(roomDoc.ToDomain());
                }

                return rooms;
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetAllRoomsAsync", ex);
                throw;
            }
        }
    }
}
