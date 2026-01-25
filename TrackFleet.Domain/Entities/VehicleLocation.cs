namespace TrackFleet.Domain.Entities;

public class VehicleLocation
{
    public Guid Id { get; private set; }
    public Guid VehicleId { get; private set; }
    public Guid TenantId { get; private set; }

    public double Latitude { get; private set; }
    public double Longitude { get; private set; }
    public DateTime RecordedAtUtc { get; private set; }

    private VehicleLocation() { }

    public static VehicleLocation Create(
        Guid vehicleId,
        Guid tenantId,
        double latitude,
        double longitude)
    {
        return new VehicleLocation
        {
            Id = Guid.NewGuid(),
            VehicleId = vehicleId,
            TenantId = tenantId,
            Latitude = latitude,
            Longitude = longitude,
            RecordedAtUtc = DateTime.UtcNow
        };
    }
}
