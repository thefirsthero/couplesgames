using Microsoft.AspNetCore.Mvc;
using CouplesGames.Application.UseCases;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;

namespace CouplesGames.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly CreateRoomUseCase _createRoomUseCase;
        private readonly JoinRoomUseCase _joinRoomUseCase;
        private readonly FirestoreService _firestoreService;

        public RoomsController(IFirebaseAuthService firebaseAuthService, CreateRoomUseCase createRoomUseCase, JoinRoomUseCase joinRoomUseCase, IFirestoreService firestoreService)
        {
            _firebaseAuthService = firebaseAuthService;
            _createRoomUseCase = createRoomUseCase;
            _joinRoomUseCase = joinRoomUseCase;
            _firestoreService = (FirestoreService)firestoreService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromHeader(Name = "Authorization")] string authorization, [FromBody] string questionId)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
                var room = await _createRoomUseCase.Execute(questionId, userId);
                return Ok(room);
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
                var room = await _joinRoomUseCase.Execute(roomId, userId);
                return Ok(room);
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("RoomsController.JoinRoom", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}
