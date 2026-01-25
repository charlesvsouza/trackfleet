using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("Tenants");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
               .IsRequired()
               .HasMaxLength(150);

        builder.Property(t => t.IsActive)
               .IsRequired();

        builder.Property(t => t.CreatedAtUtc)
               .IsRequired();
    }
}
