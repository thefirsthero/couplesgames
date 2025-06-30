namespace CouplesGames.Core.Interfaces
{
    public interface IFirebaseAuthService
    {
        Task<string> VerifyTokenAndGetUserIdAsync(string idToken);
    }
}
