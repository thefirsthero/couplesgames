using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;

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
            var room = await _firestoreService.GetRoomAsync(roomId);

            if (room == null)
                throw new InvalidOperationException("Room does not exist.");

            if (room.UserIds.Count >= 2)
                throw new InvalidOperationException("Room is full.");

            if (!room.UserIds.Contains(userId))
                room.UserIds.Add(userId);

            return await _firestoreService.UpdateRoomAsync(room);
        }
    }
}
