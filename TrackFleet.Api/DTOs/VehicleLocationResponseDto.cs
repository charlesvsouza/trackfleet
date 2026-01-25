namespace TrackFleet.Api.Dtos;

public record VehicleLocationResponseDto(
    double Latitude,
    double Longitude,
    DateTime RecordedAtUtc
);
