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
                    if (existingRoom.UserIds.Count == 0)
                        await _firestoreService.DeleteRoomAsync(existingRoom.Id);
                    else
                        await _firestoreService.UpdateRoomAsync(existingRoom);
                }
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
