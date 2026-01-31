using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Extensions;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public VehiclesController(TrackFleetDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retorna TODOS os veículos ativos do tenant.
    /// Usado pelo frontend (mapa/admin).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetVehicles()
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
                Plate = v.Plate
            })
            .OrderBy(v => v.Plate)
            .ToListAsync();

        return Ok(vehicles);
    }

    /// <summary>
    /// Retorna veículos disponíveis para início de rastreamento.
    /// Usado pelo app do motorista.
    /// </summary>
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableVehicles()
    {
        var tenantId = User.GetTenantId();

        var vehicles = await _context.Vehicles
            .AsNoTracking()
            .Where(v =>
                v.TenantId == tenantId &&
                v.IsActive)
            .Where(v =>
                !_context.TrackingSessions.Any(s =>
                    s.VehicleId == v.Id &&
                    s.IsActive))
            .Select(v => new
            {
                v.Id,
                Plate = v.Plate
            })
            .OrderBy(v => v.Plate)
            .ToListAsync();

        return Ok(vehicles);
    }
}
