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
            return Unauthorized();

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized();

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
}

public sealed class LoginRequest
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
}
