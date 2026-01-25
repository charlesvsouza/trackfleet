using TrackFleet.Domain.Entities;

namespace TrackFleet.Api.Dtos;

public record AlertEventResponseDto(
    Guid Id,
    Guid VehicleId,
    AlertType Type,
    string Message,
    DateTime OccurredAtUtc
);
