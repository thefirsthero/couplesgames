using CouplesGames.Core.Entities;

namespace CouplesGames.Core.Interfaces
{
    public interface IFirestoreService
    {
        Task<Room> CreateRoomAsync(Room room);
        Task<Room?> GetRoomAsync(string roomId);
        Task<Room> UpdateRoomAsync(Room room);
        Task<Question?> GetQuestionAsync(string questionId);
    }
}
