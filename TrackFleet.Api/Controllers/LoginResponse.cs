namespace TrackFleet.Api.Controllers;

public sealed class LoginResponse
{
    public string Token { get; init; } = default!;
    public DateTime ExpiresAtUtc { get; init; }

    public UserDto User { get; init; } = default!;
}

public sealed class UserDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = default!;
    public string Role { get; init; } = default!;
}
