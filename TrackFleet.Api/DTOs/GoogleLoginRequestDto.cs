using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Api.Dtos;

public class GoogleLoginRequestDto
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
