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

            // Guard: ensure all users have answered before reset
            if (room.UserIds.Any(uid => !room.Answers.ContainsKey(uid)))
                return room; // Skip reset if not all answered

            room.PreviousRound = new PreviousRoundData
            {
                Question = room.CurrentQuestion ?? room.QuestionId,
                AskingUserId = room.AskingUserId,
                Answers = new Dictionary<string, string>(room.Answers)
            };

            room.CurrentQuestion = null;
            room.AskingUserId = null;
            room.Answers.Clear();
            room.RoundNumber += 1;

            return await _firestoreService.UpdateRoomAsync(room);
        }
    }
}
