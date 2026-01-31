using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Security;
using TrackFleet.Infrastructure.Data;

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

    // ==================================================
    // LOGIN EMAIL / SENHA (ADMIN / WEB)
    // ==================================================
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u =>
                u.Email == dto.Email &&
                u.IsActive);

        if (user is null)
            return Unauthorized("Credenciais inválidas.");

        if (string.IsNullOrEmpty(user.PasswordHash))
            return Unauthorized("Usuário não possui login por senha.");

        if (!user.VerifyPassword(dto.Password))
            return Unauthorized("Credenciais inválidas.");

        var (token, expires) = _jwt.Generate(user);

        return Ok(new LoginResponseDto(token, expires));
    }
}
