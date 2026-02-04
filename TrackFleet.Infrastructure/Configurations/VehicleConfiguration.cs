using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("Vehicles");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(v => v.LicensePlate)
            .HasMaxLength(20);

        builder.Property(v => v.Imei)
            .IsRequired()
            .HasMaxLength(25);

        builder.Property(v => v.TrackerModel)
            .HasMaxLength(50)
            .HasDefaultValue("ST310U");

        builder.Property(v => v.IsActive)
            .HasDefaultValue(true);

        builder.Property(v => v.CreatedAt)
            .HasDefaultValueSql("NOW()"); // Para PostgreSQL

        // Índice Único para não deixar cadastrar dois veículos com mesmo rastreador
        builder.HasIndex(v => v.Imei)
            .IsUnique()
            .HasDatabaseName("IX_Vehicles_Imei");
    }
}