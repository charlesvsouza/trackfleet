namespace TrackFleet.Domain.Entities;

public class TrackingSession
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public Guid UserId { get; private set; }
    public Guid VehicleId { get; private set; }

    public DateTime StartedAtUtc { get; private set; }
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime? EndedAtUtc { get; private set; }

    public bool IsActive { get; private set; }

    protected TrackingSession() { } // EF Core

    private TrackingSession(
        Guid tenantId,
        Guid userId,
        Guid vehicleId)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        UserId = userId;
        VehicleId = vehicleId;

        StartedAtUtc = DateTime.UtcNow;
        ExpiresAtUtc = StartedAtUtc.AddHours(12);
        IsActive = true;
    }

    // FACTORY
    public static TrackingSession Start(
        Guid tenantId,
        Guid userId,
        Guid vehicleId)
    {
        return new TrackingSession(tenantId, userId, vehicleId);
    }

    public bool IsExpired()
    {
        return DateTime.UtcNow >= ExpiresAtUtc;
    }

    public void Stop(string reason = "manual")
    {
        if (!IsActive)
            return;

        IsActive = false;
        EndedAtUtc = DateTime.UtcNow;
    }
}
