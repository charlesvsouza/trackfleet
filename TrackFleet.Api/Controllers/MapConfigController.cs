using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using TrackFleet.Api.Maps;

namespace TrackFleet.Api.Controllers;

[ApiController]
[Route("api/map/config")]
[Authorize]
public class MapConfigController : ControllerBase
{
    private readonly GoogleMapsSettings _settings;

    public MapConfigController(IOptions<GoogleMapsSettings> options)
    {
        _settings = options.Value;
    }

    [HttpGet]
    public IActionResult GetConfig()
    {
        return Ok(new
        {
            provider = "google",
            defaultCenter = new
            {
                lat = _settings.DefaultCenterLat,
                lng = _settings.DefaultCenterLng
            },
            defaultZoom = _settings.DefaultZoom
        });
    }
}
