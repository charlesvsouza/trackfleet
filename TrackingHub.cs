using Microsoft.AspNetCore.SignalR;

namespace TrackFleet.Api.Hubs;

public class TrackingHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync(
            "Connected",
            Context.ConnectionId
        );

        await base.OnConnectedAsync();
    }
}
