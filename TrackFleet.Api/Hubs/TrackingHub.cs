using Microsoft.AspNetCore.SignalR;

namespace TrackFleet.Api.Hubs;

public class TrackingHub : Hub
{
    // Define o nome do evento que o Frontend escuta
    public const string VehicleLocationUpdatedEvent = "ReceivePosition";

    public async Task SendCommand(string imei, string command)
    {
        await Clients.All.SendAsync("CommandSent", imei, command);
    }
}