using Microsoft.AspNetCore.Mvc;

namespace CouplesGames.WebAPI.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealthStatus()
        {
            return Ok(new { status = "Healthy" });
        }
    }
}
