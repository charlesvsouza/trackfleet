using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace TrackFleet.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetTenantId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst("tenant_id")?.Value;

        if (string.IsNullOrWhiteSpace(value))
            throw new InvalidOperationException("TenantId não encontrado no token.");

        return Guid.Parse(value);
    }

    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value =
            user.FindFirst(JwtRegisteredClaimNames.Sub) ??
            user.FindFirst(ClaimTypes.NameIdentifier);

        if (value is null)
            throw new InvalidOperationException("UserId não encontrado no token.");

        return Guid.Parse(value.Value);
    }
}
