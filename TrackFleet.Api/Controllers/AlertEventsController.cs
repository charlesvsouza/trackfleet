using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Extensions;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/alerts/events")]
[Authorize]
public class AlertEventsController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public AlertEventsController(TrackFleetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var tenantId = User.GetTenantId();

        var events = await _context.AlertEvents
            .AsNoTracking()
            .Where(e => e.TenantId == tenantId)
            .OrderByDescending(e => e.OccurredAtUtc)
            .Select(e => new AlertEventResponseDto(
                e.Id,
                e.VehicleId,
                e.Type,
                e.Message,
                e.OccurredAtUtc
            ))
            .ToListAsync();

        return Ok(events);
    }
}
