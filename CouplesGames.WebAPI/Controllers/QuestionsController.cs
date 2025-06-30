using CouplesGames.Application.UseCases;
using CouplesGames.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/questions")]
    public class QuestionsController : Controller
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly GetSoloWYRQuestionsUseCase _getSoloWYRQuestionsUseCase;

        public QuestionsController(IFirebaseAuthService firebaseAuthService, GetSoloWYRQuestionsUseCase getSoloWYRQuestionsUseCase)
        {
            _firebaseAuthService = firebaseAuthService;
            _getSoloWYRQuestionsUseCase = getSoloWYRQuestionsUseCase;
        }

        [HttpGet("solowyr")]
        public async Task<IActionResult> GetSoloWYRQuestions([FromHeader(Name = "Authorization")] string authorization)
        {
            var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Invalid or missing authorization token.");
            }

            var questions = await _getSoloWYRQuestionsUseCase.Execute();
            return Ok(questions);
        }
    }
}
