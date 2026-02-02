using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Extensions;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
[Authorize(Roles = "admin")]
public class VehiclesController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public VehiclesController(TrackFleetDbContext context)
    {
        _context = context;
    }

    // =======================
    // LIST
    // =======================

    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        var tenantId = User.GetTenantId();

        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.TenantId == tenantId && v.IsActive)
            .Select(v => new
            {
                v.Id,
                Plate = v.Plate
            })
            .OrderBy(v => v.Plate)
            .ToListAsync();

        return Ok(vehicles);
    }

    // =======================
    // AVAILABLE (DRIVER)
    // =======================

    [HttpGet("available")]
    [Authorize(Roles = "driver")]
    public async Task<IActionResult> GetAvailableVehicles()
    {
        var tenantId = User.GetTenantId();

        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v => v.TenantId == tenantId && v.IsActive)
            .Where(v =>
                !_context.TrackingSessions.Any(s =>
                    s.VehicleId == v.Id && s.IsActive))
            .Select(v => new
            {
                v.Id,
                Plate = v.Plate
            })
            .OrderBy(v => v.Plate)
            .ToListAsync();

        return Ok(vehicles);
    }

    // =======================
    // CREATE
    // =======================

    [HttpPost]
    public async Task<IActionResult> CreateVehicle(
        [FromBody] CreateVehicleDto dto)
    {
        var tenantId = User.GetTenantId();

        var vehicle = new Vehicle(tenantId, dto.Plate);

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            vehicle.Id,
            vehicle.Plate
        });
    }

    // =======================
    // UPDATE
    // =======================

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateVehicle(
        Guid id,
        [FromBody] CreateVehicleDto dto)
    {
        var tenantId = User.GetTenantId();

        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v =>
                v.Id == id &&
                v.TenantId == tenantId &&
                v.IsActive);

        if (vehicle == null)
            return NotFound();

        vehicle.UpdatePlate(dto.Plate);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            vehicle.Id,
            vehicle.Plate
        });
    }

    // =======================
    // DELETE (SOFT)
    // =======================

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        var tenantId = User.GetTenantId();

        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v =>
                v.Id == id &&
                v.TenantId == tenantId &&
                v.IsActive);

        if (vehicle == null)
            return NotFound();

        vehicle.Deactivate();

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// =======================
// DTO
// =======================

public class CreateVehicleDto
{
    public string Plate { get; set; } = null!;
}
