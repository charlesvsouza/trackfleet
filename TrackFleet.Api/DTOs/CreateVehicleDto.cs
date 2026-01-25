namespace TrackFleet.Api.DTOs;

public record CreateVehicleDto(
    Guid TenantId,
    string Plate,
    string? Description
);
