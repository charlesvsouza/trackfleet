using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class AlertEventConfiguration : IEntityTypeConfiguration<AlertEvent>
{
    public void Configure(EntityTypeBuilder<AlertEvent> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Message).IsRequired();
        builder.Property(x => x.OccurredAtUtc).IsRequired();

        builder.HasIndex(x => new
        {
            x.TenantId,
            x.VehicleId,
            x.OccurredAtUtc
        });
    }
}
