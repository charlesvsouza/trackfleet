using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;
using TrackFleet.Infrastructure.Data;
using TrackFleet.Domain.Entities;
using TrackFleet.Domain.Security;

namespace TrackFleet.Infrastructure.Tests;

public class TrackFleetDbContextMultiTenantTests
{
    private class FakeTenantProvider : ITenantProvider
    {
        private readonly Guid _tenantId;
        public FakeTenantProvider(Guid tenantId) => _tenantId = tenantId;

        public Guid GetTenantId() => _tenantId;

        public bool TryGetTenantId(out Guid tenantId)
        {
            tenantId = _tenantId;
            return true;
        }
    }

    [Fact]
    public async Task FiltroGlobal_MultiTenant_SqliteInMemory_Works()
    {
        using var conn = new SqliteConnection("DataSource=:memory:");
        await conn.OpenAsync();

        var options = new DbContextOptionsBuilder<TrackFleetDbContext>()
            .UseSqlite(conn)
            .Options;

        // cria schema e popula dados (sem tenant provider)
        using (var schemaCtx = new TrackFleetDbContext(options))
        {
            await schemaCtx.Database.EnsureCreatedAsync();

            var tenantA = new Tenant("Tenant A");
            var tenantB = new Tenant("Tenant B");

            var userA = new User(tenantA.Id, "a@t.com", "User A", "User");
            userA.SetPassword("pwd");
            var userB = new User(tenantB.Id, "b@t.com", "User B", "User");
            userB.SetPassword("pwd");

            schemaCtx.Tenants.AddRange(tenantA, tenantB);
            schemaCtx.Users.AddRange(userA, userB);
            await schemaCtx.SaveChangesAsync();
        }

        // recupere os tenant ids persistidos
        using var ctxAll = new TrackFleetDbContext(options);
        var persistedTenantA = await ctxAll.Tenants.AsNoTracking().FirstOrDefaultAsync(t => t.Name == "Tenant A");
        var persistedTenantB = await ctxAll.Tenants.AsNoTracking().FirstOrDefaultAsync(t => t.Name == "Tenant B");
        Assert.NotNull(persistedTenantA);
        Assert.NotNull(persistedTenantB);

        // contexto que simula Tenant A
        using (var ctxA = new TrackFleetDbContext(options, new FakeTenantProvider(persistedTenantA!.Id)))
        {
            var usersA = await ctxA.Users.AsNoTracking().ToListAsync();
            Assert.Single(usersA);
            Assert.Equal(persistedTenantA.Id, usersA[0].TenantId);
        }

        using (var ctxB = new TrackFleetDbContext(options, new FakeTenantProvider(persistedTenantB!.Id)))
        {
            var usersB = await ctxB.Users.AsNoTracking().ToListAsync();
            Assert.Single(usersB);
            Assert.Equal(persistedTenantB.Id, usersB[0].TenantId);
        }
    }
}