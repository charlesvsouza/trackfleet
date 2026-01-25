namespace TrackFleet.Api.Dtos;

public record LoginResponseDto(
    string Token,
    DateTime ExpiresAtUtc
);
