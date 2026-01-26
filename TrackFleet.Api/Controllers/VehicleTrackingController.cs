using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.DTOs.Vehicles;
using TrackFleet.Api.Hubs;
using TrackFleet.Domain.Security;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId:guid}/location")]
[Authorize] // qualquer usuário autenticado do tenant
public class VehicleTrackingController : ControllerBase
{
    private readonly TrackFleetDbContext _db;
    private readonly ITenantProvider _tenantProvider;
    private readonly IHubContext<TrackingHub> _hub;

    public VehicleTrackingController(
        TrackFleetDbContext db,
        ITenantProvider tenantProvider,
        IHubContext<TrackingHub> hub)
    {
        _db = db;
        _tenantProvider = tenantProvider;
        _hub = hub;
    }

    // =======================
    // UPDATE LOCATION
    // =======================
    [HttpPut]
    public async Task<IActionResult> UpdateLocation(
        Guid vehicleId,
        [FromBody] UpdateVehicleLocationRequest request)
    {
        var tenantId = _tenantProvider.GetTenantId();

        var vehicle = await _db.Vehicles
            .FirstOrDefaultAsync(v => v.Id == vehicleId);

        if (vehicle == null)
            return NotFound();

        vehicle.UpdateLocation(
            request.Latitude,
            request.Longitude
        );

        await _db.SaveChangesAsync();

        // 🔔 EMITE EVENTO PARA O TENANT
        await _hub.Clients
            .Group(tenantId.ToString())
            .SendAsync(
                TrackingHub.VehicleLocationUpdatedEvent,
                new
                {
                    vehicle.Id,
                    vehicle.Latitude,
                    vehicle.Longitude,
                    vehicle.LastUpdateUtc
                }
            );

        return NoContent();
    }
}
