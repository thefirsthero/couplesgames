using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;

namespace CouplesGames.Application.UseCases
{
    public class JoinRoomUseCase
    {
        private readonly IFirestoreService _firestoreService;

        public JoinRoomUseCase(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Execute(string roomId, string userId)
        {
            try
            {
                var room = await _firestoreService.GetRoomAsync(roomId);

                if (room == null)
                    throw new InvalidOperationException("Room does not exist.");

                if (room.UserIds.Count >= 2)
                    throw new InvalidOperationException("Room is full.");

                if (!room.UserIds.Contains(userId))
                    room.UserIds.Add(userId);

                return await _firestoreService.UpdateRoomAsync(room);
            }
            catch (Exception ex)
            {
                if (_firestoreService is FirestoreService fs)
                {
                    await fs.LogErrorAsync("JoinRoomUseCase.Execute", ex);
                }
                throw;
            }
        }
    }
}
