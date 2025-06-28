using Microsoft.AspNetCore.Mvc;
using CouplesGamesApi.Application.UseCases;
using CouplesGamesApi.Core.Interfaces;

namespace CouplesGamesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly CreateRoomUseCase _createRoomUseCase;
        private readonly JoinRoomUseCase _joinRoomUseCase;

        public RoomsController(IFirebaseAuthService firebaseAuthService, CreateRoomUseCase createRoomUseCase, JoinRoomUseCase joinRoomUseCase)
        {
            _firebaseAuthService = firebaseAuthService;
            _createRoomUseCase = createRoomUseCase;
            _joinRoomUseCase = joinRoomUseCase;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRoom([FromHeader(Name = "Authorization")] string authorization, [FromBody] string questionId)
        {
            var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
            var room = await _createRoomUseCase.Execute(questionId, userId);
            return Ok(room);
        }

        [HttpPost("join/{roomId}")]
        public async Task<IActionResult> JoinRoom([FromHeader(Name = "Authorization")] string authorization, string roomId)
        {
            var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
            var room = await _joinRoomUseCase.Execute(roomId, userId);
            return Ok(room);
        }
    }
}
