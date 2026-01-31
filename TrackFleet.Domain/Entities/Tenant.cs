namespace TrackFleet.Domain.Entities;

public class Tenant
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = null!;
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    protected Tenant() { } // EF Core

    private Tenant(string name)
    {
        Id = Guid.NewGuid();
        Name = name;
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }

    // ✅ ÚNICO ponto permitido de criação
    public static Tenant Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tenant name is required.");

        return new Tenant(name);
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}
