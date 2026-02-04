using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Configurations;

public class VehicleLocationConfiguration : IEntityTypeConfiguration<VehicleLocation>
{
    public void Configure(EntityTypeBuilder<VehicleLocation> builder)
    {
        // Mapeia para a tabela "Positions"
        builder.ToTable("Positions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.VehicleId)
            .IsRequired();

        builder.Property(x => x.Latitude)
            .IsRequired();

        builder.Property(x => x.Longitude)
            .IsRequired();

        // Aqui estava o erro: mudamos de RecordedAtUtc para Timestamp
        builder.Property(x => x.Timestamp)
            .IsRequired();

        builder.Property(x => x.ReceivedAt)
            .HasDefaultValueSql("NOW()");

        // Índice composto para buscar histórico rápido
        builder.HasIndex(x => new { x.VehicleId, x.Timestamp })
            .HasDatabaseName("IX_Positions_VehicleId_Timestamp");
    }
}