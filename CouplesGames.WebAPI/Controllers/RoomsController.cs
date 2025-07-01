using Microsoft.AspNetCore.Mvc;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using CouplesGames.Application.Commands.Rooms;

namespace CouplesGames.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly IMediator _mediator;
        private readonly FirestoreService _firestoreService;

        public RoomsController(
            IFirebaseAuthService firebaseAuthService,
            IMediator mediator,
            IFirestoreService firestoreService)
        {
            _firebaseAuthService = firebaseAuthService;
            _mediator = mediator;
            _firestoreService = (FirestoreService)firestoreService;
        }

        public class CreateRoomRequest
        {
            public string GameMode { get; set; } = "existing_questions";
            public string? QuestionId { get; set; }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromHeader(Name = "Authorization")] string authorization, [FromBody] CreateRoomRequest request)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
                var result = await _mediator.Send(new CreateRoomCommand(request.GameMode, request.QuestionId, userId));
                return Ok(result);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.CreateRoom", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("join/{roomId}")]
        public async Task<IActionResult> JoinRoom([FromHeader(Name = "Authorization")] string authorization, string roomId)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
                var result = await _mediator.Send(new JoinRoomCommand(roomId, userId));
                return Ok(result);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.JoinRoom", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("update-question")]
        public async Task<IActionResult> UpdateQuestion([FromHeader(Name = "Authorization")] string authorization, [FromBody] UpdateQuestionCommand command)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));

                // Ensure only asking user can set question
                if (command.AskingUserId != userId)
                    return Forbid();

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.UpdateQuestion", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
