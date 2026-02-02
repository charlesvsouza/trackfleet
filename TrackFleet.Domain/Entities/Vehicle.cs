namespace TrackFleet.Domain.Entities;

public class Vehicle
{
    // =======================
    // PROPERTIES
    // =======================

    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }

    public string Plate { get; private set; } = null!;

    public bool IsActive { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }

    // 🔴 PROPRIEDADE QUE ESTAVA FALTANDO
    public DateTime LastUpdateUtc { get; private set; }

    // =======================
    // EF CORE
    // =======================

    protected Vehicle() { }

    // =======================
    // CONSTRUCTOR
    // =======================

    public Vehicle(Guid tenantId, string plate)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        Plate = plate;

        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
        LastUpdateUtc = DateTime.UtcNow;
    }

    // =======================
    // BEHAVIOR
    // =======================

    public void UpdatePlate(string plate)
    {
        if (string.IsNullOrWhiteSpace(plate))
            throw new ArgumentException("Placa inválida.");

        Plate = plate;
        Touch();
    }

    public void Deactivate()
    {
        IsActive = false;
        Touch();
    }

    private void Touch()
    {
        LastUpdateUtc = DateTime.UtcNow;
    }
}
