using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;

namespace CouplesGames.Application.Queries.Questions
{
    public class GetSoloWYRQuestionsQuery : IRequest<List<Question>>
    {
    }

    public class GetSoloWYRQuestionsQueryHandler : IRequestHandler<GetSoloWYRQuestionsQuery, List<Question>>
    {
        private readonly IFirestoreService _firestoreService;

        public GetSoloWYRQuestionsQueryHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<List<Question>> Handle(GetSoloWYRQuestionsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                return await _firestoreService.GetSoloQuestionsAsync();
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("GetSoloWYRQuestionsQueryHandler.Handle", ex);
                throw;
            }
        }
    }
}
