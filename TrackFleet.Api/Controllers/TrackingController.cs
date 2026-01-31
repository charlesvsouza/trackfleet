using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Extensions;
using TrackFleet.Api.Hubs;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/tracking")]
[Authorize]
public class TrackingController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly IHubContext<TrackingHub> _hub;

    public TrackingController(
        TrackFleetDbContext context,
        IHubContext<TrackingHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    // -------------------------------------------------
    // STATUS (ONLINE / OFFLINE)
    // -------------------------------------------------
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var tenantId = User.GetTenantId();
        var userId = User.GetUserId();

        var session = await _context.Set<TrackingSession>()
            .FirstOrDefaultAsync(s =>
                s.TenantId == tenantId &&
                s.UserId == userId &&
                s.IsActive);

        if (session is null)
        {
            return Ok(new
            {
                status = "offline"
            });
        }

        if (session.IsExpired())
        {
            session.Stop("expired");
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "offline"
            });
        }

        return Ok(new
        {
            status = "online",
            sessionId = session.Id,
            vehicleId = session.VehicleId,
            expiresAtUtc = session.ExpiresAtUtc
        });
    }

    // -------------------------------------------------
    // ACTIVE SESSION (RECONNECT)
    // -------------------------------------------------
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveSession()
    {
        var tenantId = User.GetTenantId();
        var userId = User.GetUserId();

        var session = await _context.Set<TrackingSession>()
            .FirstOrDefaultAsync(s =>
                s.TenantId == tenantId &&
                s.UserId == userId &&
                s.IsActive);

        if (session is null)
            return NoContent();

        if (session.IsExpired())
        {
            session.Stop("expired");
            await _context.SaveChangesAsync();
            return NoContent();
        }

        return Ok(new
        {
            session.Id,
            session.VehicleId,
            session.StartedAtUtc,
            session.ExpiresAtUtc
        });
    }

    // -------------------------------------------------
    // START
    // -------------------------------------------------
    [HttpPost("start")]
    public async Task<IActionResult> StartTracking(
        [FromBody] StartTrackingRequestDto dto)
    {
        var tenantId = User.GetTenantId();
        var userId = User.GetUserId();

        var hasActiveSession = await _context.Set<TrackingSession>()
            .AnyAsync(s => s.UserId == userId && s.IsActive);

        if (hasActiveSession)
            return Conflict("Usuário já possui sessão ativa.");

        var vehicleInUse = await _context.Set<TrackingSession>()
            .AnyAsync(s => s.VehicleId == dto.VehicleId && s.IsActive);

        if (vehicleInUse)
            return Conflict("Veículo já está em rastreamento.");

        var session = TrackingSession.Start(
            tenantId,
            userId,
            dto.VehicleId);

        _context.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            session.Id,
            session.VehicleId,
            session.StartedAtUtc,
            session.ExpiresAtUtc
        });
    }

    // -------------------------------------------------
    // STOP
    // -------------------------------------------------
    [HttpPost("stop")]
    public async Task<IActionResult> StopTracking(
        [FromBody] StopTrackingRequestDto dto)
    {
        var tenantId = User.GetTenantId();
        var userId = User.GetUserId();

        var session = await _context.Set<TrackingSession>()
            .FirstOrDefaultAsync(s =>
                s.TenantId == tenantId &&
                s.UserId == userId &&
                s.IsActive);

        if (session is null)
            return NotFound("Sessão ativa não encontrada.");

        session.Stop("manual");
        await _context.SaveChangesAsync();

        return Ok();
    }

    // -------------------------------------------------
    // POSITION (RATE LIMITED)
    // -------------------------------------------------
    [EnableRateLimiting("PositionRateLimit")]
    [HttpPost("position")]
    public async Task<IActionResult> SendPosition(
        [FromBody] SendPositionRequestDto dto)
    {
        var tenantId = User.GetTenantId();
        var userId = User.GetUserId();

        var session = await _context.Set<TrackingSession>()
            .FirstOrDefaultAsync(s =>
                s.Id == dto.SessionId &&
                s.TenantId == tenantId &&
                s.UserId == userId &&
                s.IsActive);

        if (session is null)
            return Unauthorized("Sessão inválida.");

        if (session.IsExpired())
        {
            session.Stop("expired");
            await _context.SaveChangesAsync();
            return Unauthorized("Sessão expirada.");
        }

        await _hub.Clients
            .Group(tenantId.ToString())
            .SendAsync(
                TrackingHub.VehicleLocationUpdatedEvent,
                new
                {
                    SessionId = session.Id,
                    VehicleId = session.VehicleId,
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude,
                    SpeedKmh = dto.SpeedKmh,
                    Heading = dto.Heading,
                    TimestampUtc = DateTime.UtcNow
                });

        return Ok();
    }
}
