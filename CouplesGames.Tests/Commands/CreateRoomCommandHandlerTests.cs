using Xunit;
using Moq;
using CouplesGames.Application.Commands.Rooms;
using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace CouplesGames.Tests.Commands
{
    public class CreateRoomCommandHandlerTests
    {
        [Fact]
        public async Task Handle_Should_Create_Room_With_UserId_And_QuestionId()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new CreateRoomCommandHandler(mockFirestore.Object);

            var command = new CreateRoomCommand("question123", "user123");

            mockFirestore.Setup(x => x.CreateRoomAsync(It.IsAny<Room>()))
                .ReturnsAsync((Room r) => r);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("question123", result.QuestionId);
            Assert.Contains("user123", result.UserIds);
        }
    }
}
