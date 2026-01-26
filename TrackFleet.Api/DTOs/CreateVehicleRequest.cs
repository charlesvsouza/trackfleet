namespace TrackFleet.Api.DTOs.Vehicles;

public record CreateVehicleRequest(
    string Plate,
    string? Description
);
