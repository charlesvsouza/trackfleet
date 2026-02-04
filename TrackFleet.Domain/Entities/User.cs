using System.ComponentModel.DataAnnotations.Schema;

namespace TrackFleet.Domain.Entities;

public class User
{
    // =======================
    // PROPERTIES
    // =======================

    public Guid Id { get; private set; }

    // No banco é "Name", aqui era "FullName". Vamos mapear.
    [Column("Name")]
    public string FullName { get; private set; } = null!;

    public string Email { get; private set; } = null!;

    public string Role { get; private set; } = null!;

    // 🔐 Login tradicional
    public string? PasswordHash { get; private set; }

    public bool IsActive { get; private set; }

    // No banco é "CreatedAt", aqui era "CreatedAtUtc". Vamos mapear.
    [Column("CreatedAt")]
    public DateTime CreatedAtUtc { get; private set; }

    // REMOVIDO: TenantId e GoogleSub (Não existem no banco atual)

    // =======================
    // EF CORE
    // =======================

    protected User() { }

    // =======================
    // CONSTRUCTOR
    // =======================

    public User(
        string email,
        string fullName,
        string role)
    {
        Id = Guid.NewGuid();
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

        // Ajuste: Vamos normalizar, mas permitir o "Admin" que já está no banco
        // O banco tem 'Admin' (Maiúsculo).

        Role = role; // Aceita como vier, para evitar erro com o dado existente
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