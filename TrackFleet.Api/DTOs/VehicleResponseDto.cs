namespace TrackFleet.Api.Dtos;

public record VehicleResponseDto(
    Guid Id,
    Guid TenantId,
    string Plate,
    string? Description,
    double Latitude,
    double Longitude,
    DateTime LastUpdateUtc,
    bool IsActive
);
