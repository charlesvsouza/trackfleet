namespace TrackFleet.Api.DTOs.Vehicles;

public record UpdateVehicleLocationRequest(
    double Latitude,
    double Longitude
);
