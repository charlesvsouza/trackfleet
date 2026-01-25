namespace TrackFleet.Domain.Entities;

public enum AlertType
{
    GeofenceEnter = 1,
    GeofenceExit = 2,
    ProlongedStop = 3,
    SpeedExceeded = 4
}
