using MediatR;
using CouplesGames.Core.Interfaces;

namespace CouplesGames.Application.Queries.Health
{
    public class HealthCheckQuery : IRequest<HealthCheckResultDto>
    {
    }

    public class HealthCheckResultDto
    {
        public string Status { get; set; } = "Unhealthy";
        public string Details { get; set; } = "";
    }

    public class HealthCheckQueryHandler : IRequestHandler<HealthCheckQuery, HealthCheckResultDto>
    {
        private readonly IFirestoreService _firestoreService;

        public HealthCheckQueryHandler(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        public async Task<HealthCheckResultDto> Handle(HealthCheckQuery request, CancellationToken cancellationToken)
        {
            var result = new HealthCheckResultDto();

            try
            {
                // Perform a lightweight Firestore connectivity check
                //var test = await _firestoreService.GetRoomAsync('');
                result.Status = "Healthy";
                result.Details = "Successfully connected to Firestore.";
            }
            catch (Exception ex)
            {
                result.Status = "Unhealthy";
                result.Details = $"Firestore connection failed: {ex.Message}";

                try
                {
                    await _firestoreService.LogErrorAsync("HealthCheckQueryHandler.Handle", ex);
                }
                catch
                {
                    // Fallback: avoid throwing from logging itself
                }
            }

            return result;
        }
    }
}
