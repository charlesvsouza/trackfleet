using TrackFleet.Domain.Entities;

namespace TrackFleet.Api.Dtos;

public record AlertRuleCreateDto(
    AlertType Type,
    Guid? VehicleId,
    double? Threshold,
    int? DurationSeconds,
    double? Latitude,
    double? Longitude
);
