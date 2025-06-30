using Xunit;
using Moq;
using CouplesGames.Application.Commands.Rooms;
using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CouplesGames.Tests.Commands
{
    public class JoinRoomCommandHandlerTests
    {
        [Fact]
        public async Task Handle_Should_Add_User_To_Room_If_Not_Already_Added()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new JoinRoomCommandHandler(mockFirestore.Object);

            var existingRoom = new Room
            {
                Id = "room1",
                QuestionId = "q1",
                UserIds = new List<string> { "existingUser" }
            };

            mockFirestore.Setup(x => x.GetRoomAsync("room1"))
                .ReturnsAsync(existingRoom);

            mockFirestore.Setup(x => x.UpdateRoomAsync(It.IsAny<Room>()))
                .ReturnsAsync((Room r) => r);

            var command = new JoinRoomCommand("room1", "newUser");

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.Contains("newUser", result.UserIds);
            Assert.Equal(2, result.UserIds.Count);
        }

        [Fact]
        public async Task Handle_Should_Throw_If_Room_Is_Full()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new JoinRoomCommandHandler(mockFirestore.Object);

            var fullRoom = new Room
            {
                Id = "room1",
                QuestionId = "q1",
                UserIds = new List<string> { "user1", "user2" }
            };

            mockFirestore.Setup(x => x.GetRoomAsync("room1"))
                .ReturnsAsync(fullRoom);

            var command = new JoinRoomCommand("room1", "newUser");

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                handler.Handle(command, CancellationToken.None));
        }
    }
}
