namespace TrackFleet.Api.DTOs.Map;

public record VehicleMapPointDto(
    Guid VehicleId,
    string Plate,
    double Latitude,
    double Longitude,
    DateTime LastUpdateUtc
);
