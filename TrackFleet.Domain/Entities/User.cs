using BCrypt.Net;

namespace TrackFleet.Domain.Entities;

public class User
{
    // =======================
    // PROPERTIES
    // =======================

    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }

    public string Email { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public string Role { get; private set; } = null!;

    // 🔐 Login tradicional
    public string? PasswordHash { get; private set; }

    // 🔑 Login Google (opcional)
    public string? GoogleSub { get; private set; }

    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    // =======================
    // EF CORE
    // =======================

    protected User() { }

    // =======================
    // CONSTRUCTOR
    // =======================

    public User(
        Guid tenantId,
        string email,
        string fullName,
        string role)
    {
        Id = Guid.NewGuid();
        TenantId = tenantId;
        Email = email;
        FullName = fullName;
        SetRole(role);

        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }

    // =======================
    // PASSWORD
    // =======================

    public void SetPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Password inválida.");

        PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password)
    {
        if (string.IsNullOrEmpty(PasswordHash))
            return false;

        return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
    }

    // =======================
    // ROLE
    // =======================

    public void SetRole(string role)
    {
        if (string.IsNullOrWhiteSpace(role))
            throw new ArgumentException("Role inválida.");

        role = role.ToLowerInvariant();

        if (role != "admin" && role != "driver")
            throw new ArgumentException("Role não permitida.");

        Role = role;
    }

    // =======================
    // GOOGLE
    // =======================

    public void SetGoogleSub(string googleSub)
    {
        if (string.IsNullOrWhiteSpace(googleSub))
            throw new ArgumentException("GoogleSub inválido.");

        GoogleSub = googleSub;
    }

    // =======================
    // STATUS
    // =======================

    public void Deactivate()
    {
        IsActive = false;
    }

    public void Activate()
    {
        IsActive = true;
    }
}
