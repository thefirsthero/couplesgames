using Xunit;
using Moq;
using CouplesGames.Application.Queries.Questions;
using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CouplesGames.Tests.Queries
{
    public class GetSoloWYRQuestionsQueryHandlerTests
    {
        [Fact]
        public async Task Handle_Should_Return_Questions_List()
        {
            // Arrange
            var mockFirestore = new Mock<IFirestoreService>();
            var handler = new GetSoloWYRQuestionsQueryHandler(mockFirestore.Object);

            var query = new GetSoloWYRQuestionsQuery();

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.Single(result);
            Assert.Equal("q1", result[0].Id);
        }
    }
}
