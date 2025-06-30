using Xunit;
using Moq;
using CouplesGames.Application.Queries.Health;
using CouplesGames.Core.Interfaces;
using System.Threading;
using System.Threading.Tasks;

namespace CouplesGames.Tests.Queries
{
    public class HealthCheckQueryHandlerTests
    {
        [Fact]
        public async Task Handle_Should_Return_Healthy_If_Firestore_Success()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new HealthCheckQueryHandler(mockFirestore.Object);

            mockFirestore.Setup(x => x.GetSoloQuestionsAsync())
                .ReturnsAsync(new List<Core.Entities.Question>());

            var query = new HealthCheckQuery();

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.Equal("Healthy", result.Status);
        }

        [Fact]
        public async Task Handle_Should_Return_Unhealthy_On_Exception()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new HealthCheckQueryHandler(mockFirestore.Object);

            mockFirestore.Setup(x => x.GetSoloQuestionsAsync())
                .ThrowsAsync(new Exception("Connection failed"));

            var query = new HealthCheckQuery();

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.Equal("Unhealthy", result.Status);
            Assert.Contains("Connection failed", result.Details);
        }
    }
}
