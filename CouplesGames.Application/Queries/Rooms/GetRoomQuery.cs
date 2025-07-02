using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Queries.Rooms
{
    public class GetRoomQuery : IRequest<Room?>
    {
        public string RoomId { get; }

        public GetRoomQuery(string roomId)
        {
            RoomId = roomId;
        }
    }

    public class GetRoomQueryHandler : IRequestHandler<GetRoomQuery, Room?>
    {
        private readonly IFirestoreService _firestoreService;

        public GetRoomQueryHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room?> Handle(GetRoomQuery request, CancellationToken cancellationToken)
        {
            try { 
                return await _firestoreService.GetRoomAsync(request.RoomId);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("GetRoomQueryHandler.Handle", ex);
                throw;
            }
        }
    }
}