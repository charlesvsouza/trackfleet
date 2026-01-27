namespace TrackFleet.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public string Plate { get; private set; } = null!;
    public string? Description { get; private set; }
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }
    public DateTime LastUpdateUtc { get; private set; }
    public bool IsActive { get; private set; }

    // EF Core
    private Vehicle() { }

    private Vehicle(
        Guid id,
        Guid tenantId,
        string plate,
        string? description)
    {
        Id = id;
        TenantId = tenantId;
        Plate = plate;
        Description = description;

        Latitude = 0;
        Longitude = 0;
        LastUpdateUtc = DateTime.UtcNow;
        IsActive = true;
    }

    // Factory
    public static Vehicle Create(Guid tenantId, string plate, string? description)
    {
        return new Vehicle(
            Guid.NewGuid(),
            tenantId,
            plate,
            description
        );
    }

    // ===== SEMANTIC UPDATES =====

    public void SetDescription(string? description)
    {
        Description = description;
        LastUpdateUtc = DateTime.UtcNow;
    }

    public void UpdateLocation(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
        LastUpdateUtc = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        LastUpdateUtc = DateTime.UtcNow;
    }
}
