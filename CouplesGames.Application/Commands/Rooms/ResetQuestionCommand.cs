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
                return room;

            // Increment round
            room.RoundNumber += 1;

            // For ask_each_other mode: set next AskingUserId
            if (room.GameMode == "ask_each_other")
            {
                string nextAskingUserId;

                if (string.IsNullOrEmpty(room.AskingUserId))
                {
                    // If no current asker, start with first user
                    nextAskingUserId = room.UserIds.First();
                }
                else
                {
                    var currentIndex = room.UserIds.IndexOf(room.AskingUserId);
                    var nextIndex = (currentIndex + 1) % room.UserIds.Count;
                    nextAskingUserId = room.UserIds[nextIndex];
                }

                room.AskingUserId = nextAskingUserId;
            }
            else
            {
                // For existing_questions mode: clear AskingUserId
                room.AskingUserId = null;
            }

            room.CurrentQuestion = null;
            room.Answers.Clear();

            return await _firestoreService.UpdateRoomAsync(room);
        }
    }
}
