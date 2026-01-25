namespace TrackFleet.Api.Dtos;

public record LoginRequestDto(
    Guid TenantId,
    string Email,
    string Password
);
