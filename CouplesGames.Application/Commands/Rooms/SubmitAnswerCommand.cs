using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Commands.Rooms
{
    public class SubmitAnswerCommand : IRequest<Room>
    {
        public string RoomId { get; set; }
        public string UserId { get; set; }
        public string Answer { get; set; }

        public SubmitAnswerCommand(string roomId, string userId, string answer)
        {
            RoomId = roomId;
            UserId = userId;
            Answer = answer;
        }
    }

    public class SubmitAnswerCommandHandler : IRequestHandler<SubmitAnswerCommand, Room>
    {
        private readonly IFirestoreService _firestoreService;

        public SubmitAnswerCommandHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Handle(SubmitAnswerCommand request, CancellationToken cancellationToken)
        {
            var room = await _firestoreService.GetRoomAsync(request.RoomId);
            if (room == null)
                throw new InvalidOperationException("Room does not exist.");

            // Update the answer for the user
            if (room.Answers.ContainsKey(request.UserId))
            {
                room.Answers[request.UserId] = request.Answer;
            }
            else
            {
                room.Answers.Add(request.UserId, request.Answer);
            }

            return await _firestoreService.UpdateRoomAsync(room);
        }
    }
}