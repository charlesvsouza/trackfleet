using Microsoft.EntityFrameworkCore;
using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public class TrackFleetDbContext : DbContext
{
    public TrackFleetDbContext(DbContextOptions<TrackFleetDbContext> options)
        : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    public DbSet<Position> Positions { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações de Veículo
        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Imei).IsUnique();
            // Removi o QueryFilter de TenantId
        });

        // Configurações de Posição
        modelBuilder.Entity<Position>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne<Vehicle>()
                  .WithMany()
                  .HasForeignKey(p => p.VehicleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configurações de Usuário
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            // Removi o QueryFilter de TenantId
        });
    }
}