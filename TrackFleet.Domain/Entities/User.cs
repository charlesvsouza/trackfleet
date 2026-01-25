using BCrypt.Net;

namespace TrackFleet.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public Guid TenantId { get; private set; }
    public string Email { get; private set; } = null!;
    public string FullName { get; private set; } = null!;
    public string Role { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public bool IsActive { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    protected User() { } // EF Core

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
        Role = role;
        IsActive = true;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void SetPassword(string password)
    {
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}
