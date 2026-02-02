using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public async Task<IActionResult> GetVehiclesForMap()
    {
        var tenantId = User.GetTenantId();

        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v =>
                v.TenantId == tenantId &&
                v.IsActive)
            .Select(v => new
            {
                v.Id,
                v.Plate
            })
            .ToListAsync();

        return Ok(vehicles);
    }
}
