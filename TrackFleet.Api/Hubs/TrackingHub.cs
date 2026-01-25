using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TrackFleet.Api.Extensions;

namespace TrackFleet.Api.Hubs;

[Authorize]
public class TrackingHub : Hub
{
    public const string VehicleLocationUpdatedEvent = "vehicleLocationUpdated";

    public override async Task OnConnectedAsync()
    {
        var tenantId = Context.User!.GetTenantId();
        await Groups.AddToGroupAsync(
            Context.ConnectionId,
            tenantId.ToString()
        );

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var tenantId = Context.User!.GetTenantId();
        await Groups.RemoveFromGroupAsync(
            Context.ConnectionId,
            tenantId.ToString()
        );

        await base.OnDisconnectedAsync(exception);
    }
}
