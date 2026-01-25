using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Extensions;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/alerts/rules")]
[Authorize]
public class AlertRulesController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public AlertRulesController(TrackFleetDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create(AlertRuleCreateDto dto)
    {
        var tenantId = User.GetTenantId();

        var rule = new AlertRule(
            tenantId,
            dto.Type,
            dto.VehicleId,
            dto.Threshold,
            dto.DurationSeconds,
            dto.Latitude,
            dto.Longitude
        );

        _context.AlertRules.Add(rule);
        await _context.SaveChangesAsync();

        return Ok(rule.Id);
    }
}
