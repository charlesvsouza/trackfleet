using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public static class DbInitializer
{
    public static void Seed(TrackFleetDbContext context)
    {
        if (context.Tenants.Any())
            return;

        var tenant = new Tenant("TrackFleet Default");

        var admin = new User(
            tenant.Id,
            "admin@trackfleet.com",
            "Administrador",
            "Admin"
        );

        admin.SetPassword("123456");

        context.Tenants.Add(tenant);
        context.Users.Add(admin);
        context.SaveChanges();
    }
}
