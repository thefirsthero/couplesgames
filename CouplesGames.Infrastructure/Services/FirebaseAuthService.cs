using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using CouplesGames.Core.Interfaces;
using Microsoft.Extensions.Options;
using CouplesGames.Core.Configuration;

namespace CouplesGames.Infrastructure.Services
{
    public class FirebaseAuthService : IFirebaseAuthService
    {
        private readonly FirebaseAuth _auth;

        public FirebaseAuthService(IOptions<FirebaseSettings> firebaseSettings)
        {
            var jsonBase64 = firebaseSettings.Value.ServiceAccountJsonBase64;
            if (string.IsNullOrEmpty(jsonBase64))
                throw new Exception("Firebase service account JSON is not configured.");

            var json = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(jsonBase64));
            if (string.IsNullOrEmpty(json))
                throw new Exception("Invalid Firebase service account JSON configuration.");

            try
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    var credential = GoogleCredential.FromJson(json);
                    FirebaseApp.Create(new AppOptions
                    {
                        Credential = credential,
                    });
                }
                _auth = FirebaseAuth.DefaultInstance;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to initialize Firebase Authentication.", ex);
            }
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
                throw new UnauthorizedAccessException("Invalid Firebase token.", ex);
            }
        }
    }
}
