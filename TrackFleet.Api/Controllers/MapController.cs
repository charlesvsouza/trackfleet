using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.DTOs.Map;
using TrackFleet.Api.Extensions;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/map")]
[Authorize]
public class MapController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public MapController(TrackFleetDbContext context)
    {
        _context = context;
    }

    [HttpGet("vehicles")]
    public async Task<ActionResult<IEnumerable<VehicleMapPointDto>>> GetVehicles()
    {
        var tenantId = User.GetTenantId();

        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.TenantId == tenantId && v.IsActive)
            .Select(v => new VehicleMapPointDto(
                v.Id,
                v.Plate,
                v.Latitude,
                v.Longitude,
                v.LastUpdateUtc
            ))
            .ToListAsync();

        return Ok(vehicles);
    }
}
