using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Extensions;
using TrackFleet.Api.Hubs;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly IHubContext<TrackingHub> _hub;

    public VehiclesController(
        TrackFleetDbContext context,
        IHubContext<TrackingHub> hub)
    {
        _context = context;
        _hub = hub;
    }

    [HttpPost]
    public async Task<IActionResult> Create(VehicleCreateDto dto)
    {
        var tenantId = User.GetTenantId();

        var vehicle = Vehicle.Create(
            tenantId,
            dto.Plate,
            dto.Description
        );

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = vehicle.Id },
            Map(vehicle)
        );
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tenantId = User.GetTenantId();

        var vehicle = await _context.Vehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(v =>
                v.Id == id &&
                v.TenantId == tenantId &&
                v.IsActive);

        if (vehicle is null)
            return NotFound();

        return Ok(Map(vehicle));
    }

    [HttpPut("{id:guid}/location")]
    public async Task<IActionResult> UpdateLocation(
        Guid id,
        VehicleLocationUpdateDto dto)
    {
        var tenantId = User.GetTenantId();

        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v =>
                v.Id == id &&
                v.TenantId == tenantId &&
                v.IsActive);

        if (vehicle is null)
            return NotFound();

        vehicle.UpdateLocation(dto.Latitude, dto.Longitude);

        var rules = _context.AlertRules
    .Where(r =>
        r.TenantId == tenantId &&
        r.IsActive &&
        r.AppliesTo(vehicle.Id))
    .ToList();

        foreach (var rule in rules)
        {
            if (rule.Type == AlertType.SpeedExceeded && rule.Threshold.HasValue)
            {
                // Simples: velocidade = deslocamento fictício
                if (Math.Abs(dto.Latitude) + Math.Abs(dto.Longitude) > rule.Threshold)
                {
                    var alert = new AlertEvent(
                        tenantId,
                        vehicle.Id,
                        rule.Type,
                        "Velocidade excedida."
                    );

                    _context.AlertEvents.Add(alert);

                    await _hub.Clients
                        .Group(tenantId.ToString())
                        .SendAsync("alertTriggered", alert);
                }
            }
        }

        var history = VehicleLocation.Create(
            vehicle.Id,
            tenantId,
            dto.Latitude,
            dto.Longitude
        );

        _context.VehicleLocations.Add(history);

        await _context.SaveChangesAsync();

        var response = Map(vehicle);

        await _hub.Clients
            .Group(tenantId.ToString())
            .SendAsync(TrackingHub.VehicleLocationUpdatedEvent, response);

        return Ok(response);
    }

    private static VehicleResponseDto Map(Vehicle v)
    {
        return new VehicleResponseDto(
            v.Id,
            v.TenantId,
            v.Plate,
            v.Description,
            v.Latitude,
            v.Longitude,
            v.LastUpdateUtc,
            v.IsActive
        );
    }
}
