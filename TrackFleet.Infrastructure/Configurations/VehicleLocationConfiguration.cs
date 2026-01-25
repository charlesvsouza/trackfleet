using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class VehicleLocationConfiguration : IEntityTypeConfiguration<VehicleLocation>
{
    public void Configure(EntityTypeBuilder<VehicleLocation> builder)
    {
        builder.ToTable("VehicleLocations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Latitude)
            .IsRequired();

        builder.Property(x => x.Longitude)
            .IsRequired();

        builder.Property(x => x.RecordedAtUtc)
            .IsRequired();

        builder.HasIndex(x => new
        {
            x.VehicleId,
            x.RecordedAtUtc
        });
    }
}
