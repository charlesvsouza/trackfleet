using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Plate)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(x => x.Plate);

        builder.Property(x => x.LastUpdateUtc)
            .IsRequired();
    }
}
