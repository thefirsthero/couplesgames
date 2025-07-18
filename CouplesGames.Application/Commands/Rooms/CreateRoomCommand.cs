using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

public class CreateRoomCommand : IRequest<Room>
{
    public string GameMode { get; set; } // "existing_questions" or "ask_each_other"
    public string? QuestionId { get; set; }
    public string UserId { get; set; }

    public CreateRoomCommand(string gameMode, string? questionId, string userId)
    {
        GameMode = gameMode;
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
            var allRooms = await _firestoreService.GetAllRoomsAsync();
            foreach (var existingRoom in allRooms)
            {
                if (existingRoom.UserIds.Contains(request.UserId))
                {
                    existingRoom.UserIds.Remove(request.UserId);
                    await _firestoreService.UpdateRoomAsync(existingRoom);
                }
            }

            var reusableRoom = allRooms.FirstOrDefault(r => r.UserIds.Count == 0 && r.GameMode == request.GameMode);

            if (reusableRoom != null)
            {
                reusableRoom.UserIds.Clear();
                reusableRoom.UserIds.Add(request.UserId);
                reusableRoom.Answers.Clear();
                reusableRoom.CurrentQuestion = null;
                reusableRoom.RoundNumber = 1;
                reusableRoom.AskingUserId = request.GameMode == "ask_each_other" ? request.UserId : null;
                reusableRoom.QuestionId = request.GameMode == "existing_questions" ? request.QuestionId : null;

                return await _firestoreService.UpdateRoomAsync(reusableRoom);
            }

            var newRoom = new Room
            {
                Id = Guid.NewGuid().ToString(),
                GameMode = request.GameMode,
                QuestionId = request.GameMode == "existing_questions" ? request.QuestionId : null,
                UserIds = new List<string> { request.UserId },
                AskingUserId = request.GameMode == "ask_each_other" ? request.UserId : null,
            };

            return await _firestoreService.CreateRoomAsync(newRoom);
        }
        catch (Exception ex)
        {
            await _firestoreService.LogErrorAsync("CreateRoomCommandHandler.Handle", ex);
            throw;
        }
    }
}
