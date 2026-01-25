using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public static class DbInitializer
{
    public static void Seed(TrackFleetDbContext context)
    {
        context.Database.EnsureCreated();

        if (!context.Tenants.Any())
        {
            var tenant = new Tenant("Empresa Demo");
            context.Tenants.Add(tenant);

            var adminUser = new User(
                tenant.Id,
                "admin@trackfleet.com",
                "Administrador",
                "Admin"
            );

            context.Users.Add(adminUser);

            context.SaveChanges();
        }
    }
}
