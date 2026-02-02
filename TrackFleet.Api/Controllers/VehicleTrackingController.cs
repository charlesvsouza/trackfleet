using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TrackFleet.Api.Hubs;
using TrackFleet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/tracking")]
[Authorize]
public class VehicleTrackingController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly IHubContext<TrackingHub> _hub;

    public VehicleTrackingController(
        TrackFleetDbContext context,
        IHubContext<TrackingHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpPost("position")]
    public async Task<IActionResult> SendPosition(
        [FromBody] VehiclePositionDto dto)
    {
        var session = await _context.TrackingSessions
            .FirstOrDefaultAsync(s =>
                s.VehicleId == dto.VehicleId &&
                s.IsActive);

        if (session == null)
            return NotFound("Sessão ativa não encontrada.");

        await _hub.Clients.Group(dto.VehicleId.ToString())
            .SendAsync("position", new
            {
                vehicleId = dto.VehicleId,
                lat = dto.Lat,
                lng = dto.Lng,
                timestamp = DateTime.UtcNow
            });

        return Ok();
    }
}

// =======================
// DTO
// =======================

public class VehiclePositionDto
{
    public Guid VehicleId { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
}
