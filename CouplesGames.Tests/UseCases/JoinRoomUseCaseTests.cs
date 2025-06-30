using System.Threading.Tasks;
using Xunit;
using Moq;
using CouplesGames.Application.UseCases;
using CouplesGames.Core.Interfaces;
using CouplesGames.Core.Entities;
using System.Collections.Generic;

namespace CouplesGames.Tests.UseCases
{
    public class JoinRoomUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddUserToRoom()
        {
            // Arrange
            var mockFirestoreService = new Mock<IFirestoreService>();
            var room = new Room
            {
                Id = "room-123",
                QuestionId = "q1",
                UserIds = new List<string> { "user1" }
            };

            mockFirestoreService.Setup(s => s.GetRoomAsync("room-123")).ReturnsAsync(room);
            mockFirestoreService.Setup(s => s.UpdateRoomAsync(It.IsAny<Room>())).ReturnsAsync((Room r) => r);

            var useCase = new JoinRoomUseCase(mockFirestoreService.Object);

            // Act
            var result = await useCase.Execute("room-123", "user2");

            // Assert
            Assert.NotNull(result);
            Assert.Contains("user2", result.UserIds);
        }
    }
}
