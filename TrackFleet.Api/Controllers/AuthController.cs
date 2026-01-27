using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackFleet.Api.Dtos;
using TrackFleet.Api.Security;
using TrackFleet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly TrackFleetDbContext _context;
    private readonly JwtTokenService _jwt;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        TrackFleetDbContext context,
        JwtTokenService jwt,
        ILogger<AuthController> logger)
    {
        _context = context;
        _jwt = jwt;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _logger.LogInformation("Login attempt for Email={Email}", dto.Email);

        // Login NÃO deve filtrar por tenant — procurar apenas por email e ativar IgnoreQueryFilters()
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u =>
                u.Email == dto.Email &&
                u.IsActive);

        if (user is null)
        {
            _logger.LogWarning("User not found for Email={Email}", dto.Email);
            return Unauthorized("Credenciais inválidas.");
        }

        if (!user.VerifyPassword(dto.Password))
        {
            _logger.LogWarning("Invalid password for Email={Email}", dto.Email);
            return Unauthorized("Credenciais inválidas.");
        }

        var (token, expires) = _jwt.Generate(user);

        return Ok(new LoginResponseDto(token, expires));
    }
}