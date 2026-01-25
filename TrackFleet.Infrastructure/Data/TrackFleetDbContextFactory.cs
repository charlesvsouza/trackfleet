using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TrackFleet.Infrastructure.Data
{
    public class TrackFleetDbContextFactory
        : IDesignTimeDbContextFactory<TrackFleetDbContext>
    {
        public TrackFleetDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../TrackFleet.Api"))
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TrackFleetDbContext>();

            optionsBuilder.UseNpgsql(
                configuration.GetConnectionString("Postgres")
            );

            return new TrackFleetDbContext(optionsBuilder.Options);
        }
    }
}
