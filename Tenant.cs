namespace TrackFleet.Domain.Entities;

/// <summary>
/// Representa uma empresa (cliente) do sistema.
/// Base do modelo multi-tenant.
/// </summary>
public class Tenant
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    // Construtor para EF Core
    protected Tenant() { }

    public Tenant(string name, string slug)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tenant name is required.");

        if (string.IsNullOrWhiteSpace(slug))
            throw new ArgumentException("Tenant slug is required.");

        Id = Guid.NewGuid();
        Name = name;
        Slug = slug.ToLowerInvariant();
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
    }

    public void Activate()
    {
        IsActive = true;
    }

    public void Rename(string newName)
    {
        if (string.IsNullOrWhiteSpace(newName))
            throw new ArgumentException("New name is required.");

        Name = newName;
    }
}
