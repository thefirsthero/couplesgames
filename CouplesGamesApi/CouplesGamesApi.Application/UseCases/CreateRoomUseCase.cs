using CouplesGamesApi.Core.Entities;
using CouplesGamesApi.Core.Interfaces;

namespace CouplesGamesApi.Application.UseCases
{
    public class CreateRoomUseCase
    {
        private readonly IFirestoreService _firestoreService;

        public CreateRoomUseCase(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<Room> Execute(string questionId, string userId)
        {
            var room = new Room
            {
                Id = Guid.NewGuid().ToString(),
                QuestionId = questionId,
                UserIds = new List<string> { userId }
            };

            return await _firestoreService.CreateRoomAsync(room);
        }
    }
}
