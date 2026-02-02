using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Plate)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(v => v.CreatedAtUtc)
            .IsRequired();

        builder.Property(v => v.LastUpdateUtc)
            .IsRequired();

        builder.HasIndex(v => new { v.TenantId, v.Plate })
            .IsUnique();
    }
}
