using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Api.Security;

public class JwtTokenService
{
    private readonly JwtSettings _settings;

    // Expiração específica para motorista (em horas)
    private const int DriverExpirationHours = 12;

    public JwtTokenService(IOptions<JwtSettings> settings)
    {
        _settings = settings.Value;
    }

    public (string token, DateTime expiresAtUtc) Generate(User user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("tenant_id", user.TenantId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_settings.SecretKey));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = ResolveExpiration(user);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return (
            new JwtSecurityTokenHandler().WriteToken(token),
            expires
        );
    }

    private DateTime ResolveExpiration(User user)
    {
        // Driver tem expiração fixa de 12h
        if (IsDriver(user))
        {
            return DateTime.UtcNow.AddHours(DriverExpirationHours);
        }

        // Demais perfis seguem configuração padrão
        return DateTime.UtcNow.AddMinutes(_settings.ExpirationMinutes);
    }

    private static bool IsDriver(User user)
    {
        // Ajuste aqui caso use enum futuramente
        return string.Equals(
            user.Role,
            "Driver",
            StringComparison.OrdinalIgnoreCase);
    }
}
