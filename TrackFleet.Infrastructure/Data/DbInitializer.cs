using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(TrackFleetDbContext context)
    {
        await context.Database.MigrateAsync();

        if (await context.Tenants.AnyAsync())
            return;

        var tenant = Tenant.Create("TrackFleet Default");

        context.Tenants.Add(tenant);
        await context.SaveChangesAsync();

        var admin = new User(
            tenant.Id,
            email: "admin@trackfleet.com",
            fullName: "Administrador",
            role: "Admin"
        );

        admin.SetPassword("123456");

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}
