// TrackFleet.Api/Services/VehiclePositionSimulator.cs

using System.Collections.Concurrent;

namespace TrackFleet.Api.Services
{
    public class VehiclePositionSimulator
    {
        private readonly ConcurrentDictionary<Guid, VehiclePosition> _positions = new();
        private readonly Random _random = new();

        private const double BaseLat = -22.9068; // RJ
        private const double BaseLng = -43.1729;

        public VehiclePosition GetNextPosition(Guid vehicleId)
        {
            return _positions.AddOrUpdate(
                vehicleId,
                _ => CreateInitialPosition(),
                (_, current) => Move(current)
            );
        }

        private VehiclePosition CreateInitialPosition()
        {
            return new VehiclePosition
            {
                Lat = BaseLat + RandomOffset(),
                Lng = BaseLng + RandomOffset(),
                Timestamp = DateTime.UtcNow
            };
        }

        private VehiclePosition Move(VehiclePosition current)
        {
            return new VehiclePosition
            {
                Lat = current.Lat + RandomOffset() / 10,
                Lng = current.Lng + RandomOffset() / 10,
                Timestamp = DateTime.UtcNow
            };
        }

        private double RandomOffset()
        {
            return (_random.NextDouble() - 0.5) * 0.01;
        }
    }

    public class VehiclePosition
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
