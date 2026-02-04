using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? LicensePlate { get; set; } // O "?" permite nulos

    [Required]
    public string Imei { get; set; } = string.Empty;

    public string TrackerModel { get; set; } = "ST310U";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // REMOVIDO ClientId para evitar erro de banco
}