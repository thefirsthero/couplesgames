using CouplesGames.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using CouplesGames.Application.Queries.Questions;
using CouplesGames.Infrastructure.Services;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/questions")]
    public class QuestionsController : Controller
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly IMediator _mediator;
        private readonly FirestoreService _firestoreService;

        public QuestionsController(
            IFirebaseAuthService firebaseAuthService,
            IMediator mediator,
            IFirestoreService firestoreService)
        {
            _firebaseAuthService = firebaseAuthService;
            _mediator = mediator;
            _firestoreService = (FirestoreService)firestoreService;
        }

        [HttpGet("solowyr")]
        public async Task<IActionResult> GetSoloWYRQuestions([FromHeader(Name = "Authorization")] string authorization)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid or missing authorization token.");
                }

                var questions = await _mediator.Send(new GetSoloWYRQuestionsQuery());
                return Ok(questions);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("QuestionsController.GetSoloWYRQuestions", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
