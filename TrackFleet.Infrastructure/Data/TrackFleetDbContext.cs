using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;
using TrackFleet.Domain.Security;

namespace TrackFleet.Infrastructure.Data;

public class TrackFleetDbContext : DbContext
{
    private readonly ITenantProvider? _tenantProvider;
    private readonly Guid? _currentTenantId;

    public Guid? TenantId => _currentTenantId;

    public TrackFleetDbContext(
        DbContextOptions<TrackFleetDbContext> options,
        ITenantProvider? tenantProvider = null
    ) : base(options)
    {
        _tenantProvider = tenantProvider;

        if (_tenantProvider != null &&
            _tenantProvider.TryGetTenantId(out var tid))
        {
            _currentTenantId = tid;
        }
        else
        {
            _currentTenantId = null;
        }
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();

    public DbSet<TrackingSession> TrackingSessions => Set<TrackingSession>();

    public DbSet<AlertRule> AlertRules => Set<AlertRule>();
    public DbSet<AlertEvent> AlertEvents => Set<AlertEvent>();
    public DbSet<VehicleLocation> VehicleLocations => Set<VehicleLocation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(TrackFleetDbContext).Assembly
        );

        modelBuilder.Entity<User>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);

        modelBuilder.Entity<Vehicle>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);

        modelBuilder.Entity<TrackingSession>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);

        modelBuilder.Entity<AlertRule>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);

        modelBuilder.Entity<AlertEvent>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);

        modelBuilder.Entity<VehicleLocation>()
            .HasQueryFilter(x =>
                _currentTenantId == null || x.TenantId == _currentTenantId);
    }
}
