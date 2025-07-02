using CouplesGames.Application.Queries.Users;
using CouplesGames.Core.Entities;
using CouplesGames.Core.Interfaces;
using CouplesGames.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFirebaseAuthService _firebaseAuthService;
        private readonly IFirestoreService _firestoreService;

        public UsersController(IMediator mediator, IFirebaseAuthService firebaseAuthService, IFirestoreService firestoreService)
        {
            _mediator = mediator;
            _firebaseAuthService = firebaseAuthService;
            _firestoreService = firestoreService;
        }

        [HttpGet("{uid}")]
        public async Task<IActionResult> GetUser([FromHeader(Name = "Authorization")] string authorization,string uid)
        {
            try
            {
                var userId = await _firebaseAuthService.VerifyTokenAndGetUserIdAsync(authorization.Replace("Bearer ", ""));
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid or missing authorization token.");
                }

                var user = await _mediator.Send(new GetUserQuery(uid));
                return Ok(user);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid token");
            }
            catch (Exception ex)
            {
                await _firestoreService.LogErrorAsync("UsersController.GetUser", ex);
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
    }
}