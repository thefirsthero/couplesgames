using Microsoft.AspNetCore.Mvc;
using CouplesGames.Core.Interfaces;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogsController : ControllerBase
    {
        private readonly IFirestoreService _firestoreService;
        public LogsController(IFirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        [HttpPost("frontend-error")]
        public async Task<IActionResult> LogFrontendError([FromBody] FrontendErrorDto error)
        {
            await _firestoreService.LogErrorAsync("Frontend", new Exception($"{error.Message}\n{error.Stack}"));
            return Ok();
        }
    }

    public class FrontendErrorDto
    {
        public string Message { get; set; } = "";
        public string Stack { get; set; } = "";
    }
}