using Microsoft.AspNetCore.Mvc;
using MediatR;
using CouplesGames.Application.Queries.Health;
using CouplesGames.Core.Interfaces;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFirestoreService _firestoreService;

        public HealthController(IMediator mediator, IFirestoreService firestoreService)
        {
            _mediator = mediator;
            _firestoreService = firestoreService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealthStatus()
        {
            try
            {
                var result = await _mediator.Send(new HealthCheckQuery());
                if (result.Status == "Healthy")
                    return Ok(result);
                else
                    return StatusCode(503, result); // 503 Service Unavailable
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("HealthController.GetHealthStatus", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
