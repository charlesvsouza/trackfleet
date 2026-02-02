using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(TrackFleetDbContext context)
    {
        await context.Database.MigrateAsync();

        // ==========================
        // TENANT
        // ==========================
        var tenant = await context.Tenants.FirstOrDefaultAsync();

        if (tenant == null)
        {
            tenant = Tenant.Create("TrackFleet Default");
            context.Tenants.Add(tenant);
            await context.SaveChangesAsync();
        }

        // ==========================
        // ADMIN USER
        // ==========================
        const string adminEmail = "admin@trackfleet.com";

        var adminExists = await context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == adminEmail);

        if (!adminExists)
        {
            var admin = new User(
                tenant.Id,
                email: adminEmail,
                fullName: "Administrador",
                role: "Admin"
            );

            admin.SetPassword("123456");

            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}
