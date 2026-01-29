using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Hubs;
using TrackFleet.Api.Services;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Services
{
    public class VehicleTrackingBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHubContext<TrackingHub> _hubContext;
        private readonly VehiclePositionSimulator _simulator;

        private const int IntervalSeconds = 5;

        public VehicleTrackingBackgroundService(
            IServiceScopeFactory scopeFactory,
            IHubContext<TrackingHub> hubContext,
            VehiclePositionSimulator simulator)
        {
            _scopeFactory = scopeFactory;
            _hubContext = hubContext;
            _simulator = simulator;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<TrackFleetDbContext>();

                var vehicles = await db.Vehicles
                    .AsNoTracking()
                    .Select(v => v.Id)
                    .ToListAsync(stoppingToken);

                foreach (var vehicleId in vehicles)
                {
                    var position = _simulator.GetNextPosition(vehicleId);

                    await _hubContext.Clients.All.SendAsync(
                        "vehiclePositionUpdated",
                        new
                        {
                            vehicleId,
                            lat = position.Lat,
                            lng = position.Lng,
                            timestamp = position.Timestamp
                        },
                        cancellationToken: stoppingToken
                    );
                }

                await Task.Delay(TimeSpan.FromSeconds(IntervalSeconds), stoppingToken);
            }
        }
    }
}
