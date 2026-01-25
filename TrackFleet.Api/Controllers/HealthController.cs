using Microsoft.AspNetCore.Mvc;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            service = "TrackFleet API",
            timestampUtc = DateTime.UtcNow
        });
    }
}
