using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Infrastructure.Data;

/// <summary>
/// Factory usada pelo EF Core em tempo de design (migrations).
/// </summary>
public class TrackFleetDbContextFactory
    : IDesignTimeDbContextFactory<TrackFleetDbContext>
{
    public TrackFleetDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<TrackFleetDbContext>();

        optionsBuilder.UseNpgsql(
            "Host=localhost;Port=5432;Database=trackfleet;Username=trackfleet;Password=trackfleet123"
        );

        return new TrackFleetDbContext(optionsBuilder.Options);
    }
}
