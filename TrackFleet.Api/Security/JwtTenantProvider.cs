using System.Security.Claims;
using TrackFleet.Domain.Security;

namespace TrackFleet.Api.Security;

public class JwtTenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public JwtTenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetTenantId()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user == null || !user.Identity!.IsAuthenticated)
            throw new InvalidOperationException("Usuário não autenticado.");

        var tenantClaim = user.FindFirst("tenant_id")?.Value;

        if (string.IsNullOrWhiteSpace(tenantClaim))
            throw new InvalidOperationException("Claim tenant_id não encontrada no token.");

        return Guid.Parse(tenantClaim);
    }

    public bool TryGetTenantId(out Guid tenantId)
    {
        tenantId = Guid.Empty;

        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
            return false;

        var tenantClaim = user.FindFirst("tenant_id")?.Value;
        if (string.IsNullOrWhiteSpace(tenantClaim))
            return false;

        return Guid.TryParse(tenantClaim, out tenantId);
    }
}
