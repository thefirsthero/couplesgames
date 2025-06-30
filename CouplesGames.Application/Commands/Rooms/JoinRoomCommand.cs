using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Commands.Rooms
{
    public class JoinRoomCommand : IRequest<Room>
    {
        public string RoomId { get; set; }
        public string UserId { get; set; }

        public JoinRoomCommand(string roomId, string userId)
        {
            RoomId = roomId;
            UserId = userId;
        }
    }

    public class JoinRoomCommandHandler : IRequestHandler<JoinRoomCommand, Room>
    {
        private readonly IFirestoreService _firestoreService;

        public JoinRoomCommandHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Handle(JoinRoomCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var room = await _firestoreService.GetRoomAsync(request.RoomId);

                if (room == null)
                    throw new InvalidOperationException("Room does not exist.");

                if (room.UserIds.Count >= 2)
                    throw new InvalidOperationException("Room is full.");

                if (!room.UserIds.Contains(request.UserId))
                    room.UserIds.Add(request.UserId);

                return await _firestoreService.UpdateRoomAsync(room);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("JoinRoomCommandHandler.Handle", ex);
                throw;
            }
        }
    }
}
