using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Commands.Rooms
{
    public class CreateRoomCommand : IRequest<Room>
    {
        public string QuestionId { get; set; }
        public string UserId { get; set; }

        public CreateRoomCommand(string questionId, string userId)
        {
            QuestionId = questionId;
            UserId = userId;
        }
    }

    public class CreateRoomCommandHandler : IRequestHandler<CreateRoomCommand, Room>
    {
        private readonly IFirestoreService _firestoreService;

        public CreateRoomCommandHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var room = new Room
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = request.QuestionId,
                    UserIds = new List<string> { request.UserId }
                };

                return await _firestoreService.CreateRoomAsync(room);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("CreateRoomCommandHandler.Handle", ex);
                throw;
            }
        }
    }
}
