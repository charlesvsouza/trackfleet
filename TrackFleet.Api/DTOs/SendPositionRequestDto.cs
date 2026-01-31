using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Api.Dtos;

public class SendPositionRequestDto
{
    [Required]
    public Guid SessionId { get; set; }

    [Required]
    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Required]
    [Range(-180, 180)]
    public double Longitude { get; set; }

    /// <summary>
    /// Opcional. Velocidade em km/h (calculada no frontend).
    /// </summary>
    public double? SpeedKmh { get; set; }

    /// <summary>
    /// Opcional. Heading em graus (0–360).
    /// </summary>
    [Range(0, 360)]
    public double? Heading { get; set; }

    /// <summary>
    /// Timestamp UTC do ponto (se não enviado, backend usa UtcNow).
    /// </summary>
    public DateTime? TimestampUtc { get; set; }
}
