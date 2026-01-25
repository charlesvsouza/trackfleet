using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Extensions;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId:guid}/locations")]
[Authorize]
public class VehicleLocationsController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public VehicleLocationsController(TrackFleetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetHistory(
        Guid vehicleId,
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        [FromQuery] int limit = 100)
    {
        var tenantId = User.GetTenantId();

        var query = _context.VehicleLocations
            .AsNoTracking()
            .Where(x =>
                x.VehicleId == vehicleId &&
                x.TenantId == tenantId);

        if (fromUtc.HasValue)
            query = query.Where(x => x.RecordedAtUtc >= fromUtc.Value);

        if (toUtc.HasValue)
            query = query.Where(x => x.RecordedAtUtc <= toUtc.Value);

        var data = await query
            .OrderByDescending(x => x.RecordedAtUtc)
            .Take(Math.Clamp(limit, 1, 1000))
            .Select(x => new VehicleLocationResponseDto(
                x.Latitude,
                x.Longitude,
                x.RecordedAtUtc
            ))
            .ToListAsync();

        return Ok(data);
    }
}
