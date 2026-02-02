using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Extensions;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public UsersController(TrackFleetDbContext context)
    {
        _context = context;
    }

    // =======================
    // LIST
    // =======================

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var tenantId = User.GetTenantId();

        var users = await _context.Users
            .AsNoTracking()
            .Where(u => u.TenantId == tenantId)
            .OrderBy(u => u.Email)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.Role,
                u.IsActive
            })
            .ToListAsync();

        return Ok(users);
    }

    // =======================
    // CREATE
    // =======================

    [HttpPost]
    public async Task<IActionResult> CreateUser(
        [FromBody] CreateUserDto dto)
    {
        var tenantId = User.GetTenantId();

        var user = new User(
            tenantId,
            dto.Email,
            dto.FullName,
            dto.Role
        );

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.SetPassword(dto.Password);
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.FullName,
            user.Role,
            user.IsActive
        });
    }

    // =======================
    // UPDATE ROLE
    // =======================

    [HttpPut("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(
        Guid id,
        [FromBody] UpdateUserRoleDto dto)
    {
        var tenantId = User.GetTenantId();

        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Id == id &&
                u.TenantId == tenantId);

        if (user == null)
            return NotFound();

        user.SetRole(dto.Role);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =======================
    // ACTIVATE / DEACTIVATE
    // =======================

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id)
    {
        var tenantId = User.GetTenantId();

        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Id == id &&
                u.TenantId == tenantId);

        if (user == null)
            return NotFound();

        if (user.IsActive)
            user.Deactivate();
        else
            user.Activate();

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// =======================
// DTOs
// =======================

public class CreateUserDto
{
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Role { get; set; } = "driver";
    public string? Password { get; set; }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = null!;
}
