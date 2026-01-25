namespace TrackFleet.Domain.Entities;

public class AlertRule
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public Guid? VehicleId { get; private set; } // null = todos
    public AlertType Type { get; private set; }

    // Parâmetros simples (JSON-free por enquanto)
    public double? Threshold { get; private set; } // velocidade, raio, etc.
    public int? DurationSeconds { get; private set; } // parada
    public double? Latitude { get; private set; } // geofence
    public double? Longitude { get; private set; } // geofence
    public bool IsActive { get; private set; }

    private AlertRule() { }

    public AlertRule(
        Guid tenantId,
        AlertType type,
        Guid? vehicleId = null,
        double? threshold = null,
        int? durationSeconds = null,
        double? latitude = null,
        double? longitude = null)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        VehicleId = vehicleId;
        Type = type;
        Threshold = threshold;
        DurationSeconds = durationSeconds;
        Latitude = latitude;
        Longitude = longitude;
        IsActive = true;
    }

    public bool AppliesTo(Guid vehicleId)
        => !VehicleId.HasValue || VehicleId.Value == vehicleId;
}
