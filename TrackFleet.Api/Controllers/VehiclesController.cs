using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;
using TrackFleet.Domain.Security;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly ITenantProvider _tenantProvider;

    public VehiclesController(TrackFleetDbContext context, ITenantProvider tenantProvider)
    {
        _context = context;
        _tenantProvider = tenantProvider;
    }

    // GET: api/vehicles
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .ToListAsync();

        return Ok(vehicles);
    }

    // POST: api/vehicles
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleRequest request)
    {
        // Validação simples
        if (await _context.Vehicles.AnyAsync(v => v.Imei == request.Imei))
        {
            return BadRequest("Já existe um veículo com este IMEI.");
        }

        var vehicle = new Vehicle
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            LicensePlate = request.LicensePlate,
            Imei = request.Imei,
            TrackerModel = request.TrackerModel ?? "ST310U",
            IsActive = true
        };

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = vehicle.Id }, vehicle);
    }

    // DELETE: api/vehicles/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null) return NotFound();

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTO Simples para receber os dados
public class CreateVehicleRequest
{
    public string Name { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Imei { get; set; } = string.Empty;
    public string? TrackerModel { get; set; }
}