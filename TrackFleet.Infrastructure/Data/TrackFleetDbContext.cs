using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public class TrackFleetDbContext : DbContext
{
    public TrackFleetDbContext(DbContextOptions<TrackFleetDbContext> options)
        : base(options)
    {
    }
    public DbSet<AlertRule> AlertRules => Set<AlertRule>();
    public DbSet<AlertEvent> AlertEvents => Set<AlertEvent>();

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<VehicleLocation> VehicleLocations => Set<VehicleLocation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(TrackFleetDbContext).Assembly
        );
    }
}
