namespace TrackFleet.Api.Maps;

public class GoogleMapsSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string DefaultCenterLat { get; set; } = "-22.9068"; // Rio (default)
    public string DefaultCenterLng { get; set; } = "-43.1729";
    public int DefaultZoom { get; set; } = 12;
}
