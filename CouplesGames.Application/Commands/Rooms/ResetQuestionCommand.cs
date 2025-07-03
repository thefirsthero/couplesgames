using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Commands.Rooms
{
    public class ResetQuestionCommand : IRequest<Room>
    {
        public string RoomId { get; set; }

        public ResetQuestionCommand(string roomId)
        {
            RoomId = roomId;
        }
    }

    public class ResetQuestionCommandHandler : IRequestHandler<ResetQuestionCommand, Room>
    {
        private readonly IFirestoreService _firestoreService;

        public ResetQuestionCommandHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Handle(ResetQuestionCommand request, CancellationToken cancellationToken)
        {
            var room = await _firestoreService.GetRoomAsync(request.RoomId);
            if (room == null)
                throw new InvalidOperationException("Room does not exist.");

            room.CurrentQuestion = null;
            room.Answers.Clear();

            return await _firestoreService.UpdateRoomAsync(room);
        }
    }
}
