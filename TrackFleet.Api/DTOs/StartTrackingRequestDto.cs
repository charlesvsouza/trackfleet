using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Api.Dtos;

public class StartTrackingRequestDto
{
    [Required]
    public Guid VehicleId { get; set; }
}
