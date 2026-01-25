namespace TrackFleet.Domain.Entities;

public class AlertEvent
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public Guid VehicleId { get; private set; }
    public AlertType Type { get; private set; }
    public DateTime OccurredAtUtc { get; private set; }
    public string Message { get; private set; } = null!;

    private AlertEvent() { }

    public AlertEvent(
        Guid tenantId,
        Guid vehicleId,
        AlertType type,
        string message)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        VehicleId = vehicleId;
        Type = type;
        Message = message;
        OccurredAtUtc = DateTime.UtcNow;
    }
}
