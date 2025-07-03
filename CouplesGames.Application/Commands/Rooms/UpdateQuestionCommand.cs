using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Commands.Rooms
{
    public class UpdateQuestionCommand : IRequest<Room>
    {
        public string RoomId { get; set; }
        public string Question { get; set; }
        public string AskingUserId { get; set; }

        public UpdateQuestionCommand(string roomId, string question, string askingUserId)
        {
            RoomId = roomId;
            Question = question;
            AskingUserId = askingUserId;
        }
    }

    public class UpdateQuestionCommandHandler : IRequestHandler<UpdateQuestionCommand, Room>
    {
        private readonly IFirestoreService _firestoreService;

        public UpdateQuestionCommandHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Handle(UpdateQuestionCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var room = await _firestoreService.GetRoomAsync(request.RoomId);
                if (room == null)
                    throw new InvalidOperationException("Room does not exist.");

                room.CurrentQuestion = request.Question;
                room.AskingUserId = request.AskingUserId;

                return await _firestoreService.UpdateRoomAsync(room);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("UpdateQuestionCommandHandler.Handle", ex);
                throw;
            }
        }
    }
}
