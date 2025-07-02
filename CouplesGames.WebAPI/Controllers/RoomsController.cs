using CouplesGames.Application.Commands.Rooms;
using CouplesGames.Application.Queries.Rooms;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CouplesGames.WebAPI.Controllers
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
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
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
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
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
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.UpdateQuestion", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetRoom([FromHeader(Name = "Authorization")] string authorization, string roomId)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid or missing authorization token.");
                }

                var room = await _mediator.Send(new GetRoomQuery(roomId));
                if (room == null)
                {
                    return NotFound();
                }

                // Verify user is in the room
                if (!room.UserIds.Contains(userId))
                {
                    return Forbid();
                }

                return Ok(room);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.GetRoom", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("answer")]
        public async Task<IActionResult> SubmitAnswer(
            [FromHeader(Name = "Authorization")] string authorization,
            [FromBody] SubmitAnswerCommand command)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));

                // Ensure only the user can submit their own answer
                if (command.UserId != userId)
                    return Forbid();

                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.SubmitAnswer", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
