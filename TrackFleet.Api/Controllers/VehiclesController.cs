using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.DTOs;
using TrackFleet.Api.DTOs.Vehicles;
using TrackFleet.Domain.Entities;
using TrackFleet.Domain.Security;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
[Authorize] // qualquer usuário autenticado pode ler
public class VehiclesController : ControllerBase
{
    private readonly TrackFleetDbContext _db;
    private readonly ITenantProvider _tenantProvider;

    public VehiclesController(
        TrackFleetDbContext db,
        ITenantProvider tenantProvider)
    {
        _db = db;
        _tenantProvider = tenantProvider;
    }

    // =======================
    // CREATE
    // =======================
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<VehicleResponseDto>> Create(
        [FromBody] CreateVehicleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Plate))
            return BadRequest("Plate is required.");

        var tenantId = _tenantProvider.GetTenantId();

        var exists = await _db.Vehicles
            .AnyAsync(v =>
                v.Plate == request.Plate &&
                v.IsActive);

        if (exists)
            return Conflict("Vehicle with this plate already exists.");

        var vehicle = Vehicle.Create(
            tenantId,
            request.Plate,
            request.Description
        );

        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = vehicle.Id },
            Map(vehicle)
        );
    }

    // =======================
    // READ (LIST)
    // =======================
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VehicleResponseDto>>> GetAll()
    {
        var vehicles = await _db.Vehicles
            .AsNoTracking()
            .Where(v => v.IsActive)
            .ToListAsync();

        return vehicles.Select(Map).ToList();
    }

    // =======================
    // READ (BY ID)
    // =======================
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<VehicleResponseDto>> GetById(Guid id)
    {
        var vehicle = await _db.Vehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == id && v.IsActive);

        if (vehicle == null)
            return NotFound();

        return Map(vehicle);
    }



    // =======================
    // UPDATE (METADATA)
    // =======================
    [HttpPut("{id:guid}/metadata")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(
     Guid id,
     [FromBody] UpdateVehicleRequest request)

    {
        var vehicle = await _db.Vehicles
    .FirstOrDefaultAsync(v => v.Id == id && v.IsActive);

        if (vehicle == null)
            return NotFound();

        vehicle.SetDescription(request.Description);

        await _db.SaveChangesAsync();
        return NoContent();

    }

    // =======================
    // DELETE (SOFT)
    // =======================
    [HttpDelete("{id:guid}/deactivate")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Deactivate(Guid id)

    {
        var vehicle = await _db.Vehicles
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vehicle == null)
            return NotFound();

        vehicle.Deactivate();
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // =======================
    // MAPPER
    // =======================
    private static VehicleResponseDto Map(Vehicle v) =>
        new(
            v.Id,
            v.Plate,
            v.Description,
            v.Latitude,
            v.Longitude,
            v.LastUpdateUtc,
            v.IsActive
        );
}
