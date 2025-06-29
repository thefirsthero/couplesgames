using System.Threading.Tasks;
using Xunit;
using Moq;
using CouplesGames.Application.UseCases;
using CouplesGames.Core.Interfaces;
using CouplesGames.Core.Entities;

namespace CouplesGames.Tests.UseCases
{
    public class CreateRoomUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldCreateRoomSuccessfully()
        {
            // Arrange
            var mockFirestoreService = new Mock<IFirestoreService>();
            var expectedRoom = new Room
            {
                Id = "room-123",
                QuestionId = "q1",
                UserIds = new System.Collections.Generic.List<string> { "user1" }
            };

            mockFirestoreService
                .Setup(s => s.CreateRoomAsync(It.IsAny<Room>()))
                .ReturnsAsync(expectedRoom);

            var useCase = new CreateRoomUseCase(mockFirestoreService.Object);

            // Act
            var result = await useCase.Execute("q1", "user1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedRoom.Id, result.Id);
            Assert.Contains("user1", result.UserIds);
        }
    }
}
