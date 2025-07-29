using Microsoft.AspNetCore.SignalR;
using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;

namespace CouplesGames.WebAPI.Hubs
{
    public class GameHub : Hub
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly IFirestoreService _firestoreService;

        public GameHub(IFirebaseAuthService firebaseAuthService, IFirestoreService firestoreService)
        {
            _firebaseAuthService = firebaseAuthService;
            _firestoreService = firestoreService;
        }

        public override async Task OnConnectedAsync()
        {
            var token = Context.GetHttpContext()?.Request.Query["token"].ToString();
            if (string.IsNullOrEmpty(token))
            {
                Context.Abort();
                return;
            }

            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(token);
                if (string.IsNullOrEmpty(userId))
                {
                    Context.Abort();
                    return;
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, userId);

                await base.OnConnectedAsync();
            }
            catch
            {
                Context.Abort();
            }
        }

        public async Task JoinRoom(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room_{roomId}");
        }

        public async Task LeaveRoom(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"room_{roomId}");
        }
    }
}