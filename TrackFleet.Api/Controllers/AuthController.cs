using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Security;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly TrackFleetDbContext _dbContext;
    private readonly JwtTokenGenerator _jwtTokenGenerator;

    public AuthController(
        TrackFleetDbContext dbContext,
        JwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request)
    {
        var user = await _dbContext.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (user is null)
            return Unauthorized("Usuário não encontrado.");

        // Verifica se a senha bate com o Hash do banco
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Senha incorreta.");

        var (token, expiresAtUtc) = _jwtTokenGenerator.Generate(user);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role
            }
        });
    }

    // --- UTILITÁRIO PARA GERAR SENHA (Use apenas para criar usuários manualmente) ---
    [AllowAnonymous]
    [HttpGet("gen-hash/{password}")]
    public IActionResult GenerateHash(string password)
    {
        // Gera o Hash compatível com o método Login
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        return Ok(new { Password = password, Hash = hash });
    }
}

public sealed class LoginRequest
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}