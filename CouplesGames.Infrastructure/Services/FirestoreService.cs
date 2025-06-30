using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
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
                await docRef.SetAsync(room);
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
                return snapshot.Exists ? snapshot.ConvertTo<Room>() : null;
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
                await docRef.SetAsync(room);
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
                return snapshot.Exists ? snapshot.ConvertTo<Question>() : null;
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetQuestionAsync", ex);
                throw;
            }
        }

        public async Task<List<Question>> GetSoloQuestionsAsync()
        {
            try
            {
                var collectionRef = _db.Collection("would_you_rather");
                var snapshot = await collectionRef.GetSnapshotAsync();

                var questions = new List<Question>();
                foreach (var doc in snapshot.Documents)
                {
                    if (doc.Exists)
                    {
                        var data = doc.ToDictionary();
                        var createdAt = doc.CreateTime?.ToDateTime() ?? DateTime.UtcNow;

                        var question = new Question
                        {
                            Id = doc.Id,
                            OptionA = data.TryGetValue("option1", out object? optionA) && optionA != null ? optionA.ToString()! : "",
                            OptionB = data.TryGetValue("option2", out object? optionB) && optionB != null ? optionB.ToString()! : "",
                            CreatedAt = DateTime.SpecifyKind(createdAt, DateTimeKind.Utc)
                        };
                        questions.Add(question);
                    }
                }

                return questions;
            }
            catch (Exception ex)
            {
                await LogErrorAsync("GetSoloQuestionsAsync", ex);
                throw;
            }
        }
    }
}
