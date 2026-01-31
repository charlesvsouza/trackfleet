using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace TrackFleet.Api.Security;

public class GoogleTokenValidator
{
    private readonly GoogleAuthSettings _settings;

    public GoogleTokenValidator(
        IOptions<GoogleAuthSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task<GoogleJsonWebSignature.Payload?> Validate(string idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
            return null;

        var validationSettings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _settings.ClientId }
        };

        try
        {
            return await GoogleJsonWebSignature.ValidateAsync(
                idToken,
                validationSettings);
        }
        catch
        {
            return null;
        }
    }
}
