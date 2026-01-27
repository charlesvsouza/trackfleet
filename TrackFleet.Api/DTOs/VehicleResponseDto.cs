namespace TrackFleet.Api.DTOs;

public record VehicleResponse(
    Guid Id,
    string Plate,
    string? Description,
    double Latitude,
    double Longitude,
    DateTime LastUpdateUtc,
    bool IsActive
);
