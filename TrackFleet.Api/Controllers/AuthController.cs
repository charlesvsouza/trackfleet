using Microsoft.AspNetCore.Mvc;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Security;
using TrackFleet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly JwtTokenService _jwt;

    public AuthController(
        TrackFleetDbContext context,
        JwtTokenService jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email == dto.Email &&
                u.TenantId == dto.TenantId &&
                u.IsActive);

        if (user is null || !user.VerifyPassword(dto.Password))
            return Unauthorized("Credenciais inválidas.");

        var (token, expires) = _jwt.Generate(user);

        return Ok(new LoginResponseDto(token, expires));
    }
}
