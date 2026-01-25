namespace TrackFleet.Api.Dtos;

public record VehicleCreateDto(
    string Plate,
    string? Description
);
