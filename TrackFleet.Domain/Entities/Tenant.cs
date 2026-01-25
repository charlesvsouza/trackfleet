namespace TrackFleet.Domain.Entities;

public class Tenant
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    protected Tenant() { } // EF Core

    public Tenant(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }
}
