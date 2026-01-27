namespace TrackFleet.Api.DTOs;

public record VehicleResponseDto(
    Guid Id,
    string Plate,
    string? Description,
    double Latitude,
    double Longitude,
    DateTime LastUpdateUtc,
    bool IsActive
);
