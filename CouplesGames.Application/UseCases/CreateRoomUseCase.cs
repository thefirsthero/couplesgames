using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;

namespace CouplesGames.Application.UseCases
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
            try
            {
                var room = new Room
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = questionId,
                    UserIds = new List<string> { userId }
                };

                return await _firestoreService.CreateRoomAsync(room);
            }
            catch (Exception ex)
            {
                if (_firestoreService is FirestoreService fs)
                {
                    await fs.LogErrorAsync("CreateRoomUseCase.Execute", ex);
                }
                throw;
            }
        }
    }
}
