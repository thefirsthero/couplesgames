using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using CouplesGames.Core.Interfaces;

namespace CouplesGames.Infrastructure.Services
{
    public class FirebaseAuthService : IFirebaseAuthService
    {
        private readonly FirebaseAuth _auth;

        public FirebaseAuthService()
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                var jsonBase64 = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT_JSON_BASE64");
                if (string.IsNullOrEmpty(jsonBase64))
                    throw new Exception("Missing FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.");

                var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(jsonBase64));

                if (string.IsNullOrEmpty(json))
                    throw new Exception("Invalid FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 environment variable.");

                var credential = GoogleCredential.FromJson(json);

                FirebaseApp.Create(new AppOptions
                {
                    Credential = credential,
                });
            }

            _auth = FirebaseAuth.DefaultInstance;
        }

        public async Task<string> VerifyTokenAndGetUserIdAsync(string idToken)
        {
            try
            {
                var decodedToken = await _auth.VerifyIdTokenAsync(idToken);
                return decodedToken.Uid;
            }
            catch (Exception ex)
            {
                // Consider logging this using FirestoreService if DI allows it, else throw directly
                throw new UnauthorizedAccessException("Invalid Firebase token.", ex);
            }
        }
    }
}
