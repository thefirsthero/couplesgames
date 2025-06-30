using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using MediatR;
using System.Globalization;

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
                var questions = new List<Question>();

                var filePath = Path.Combine(AppContext.BaseDirectory, "wyr_solo_questions.csv");

                if (!File.Exists(filePath))
                    throw new FileNotFoundException("The WYR questions CSV file was not found.", filePath);

                using var reader = new StreamReader(filePath);
                bool isHeader = true;

                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();

                    if (isHeader)
                    {
                        isHeader = false;
                        continue; // Skip header line
                    }

                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    var parts = line.Split(',');

                    if (parts.Length < 4)
                        continue; // Skip invalid lines

                    var question = new Question
                    {
                        Id = Guid.NewGuid().ToString(),
                        OptionA = parts[0].Trim(),
                        OptionB = parts[2].Trim(),
                        CreatedAt = DateTime.UtcNow
                    };

                    questions.Add(question);
                }

                return questions;
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("GetSoloWYRQuestionsQueryHandler.Handle", ex);
                throw;
            }
        }
    }
}
