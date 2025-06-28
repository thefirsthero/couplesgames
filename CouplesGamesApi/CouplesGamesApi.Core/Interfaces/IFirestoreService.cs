using CouplesGamesApi.Core.Entities;

namespace CouplesGamesApi.Core.Interfaces
{
    public interface IFirestoreService
    {
        Task<Room> CreateRoomAsync(Room room);
        Task<Room?> GetRoomAsync(string roomId);
        Task<Room> UpdateRoomAsync(Room room);
        Task<Question?> GetQuestionAsync(string questionId);
    }
}
