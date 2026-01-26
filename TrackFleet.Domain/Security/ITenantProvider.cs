namespace TrackFleet.Domain.Security;

public interface ITenantProvider
{
    Guid GetTenantId();

    // Método não‑lançante para cenários sem HttpContext (migrations, seed, tests)
    bool TryGetTenantId(out Guid tenantId);
}
