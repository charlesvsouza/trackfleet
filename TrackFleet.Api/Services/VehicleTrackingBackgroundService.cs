using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Services;

public class VehicleTrackingBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<VehicleTrackingBackgroundService> _logger;

    // Intervalo entre ciclos normais
    private static readonly TimeSpan LoopDelay = TimeSpan.FromSeconds(5);

    // Intervalo após erro (backoff simples)
    private static readonly TimeSpan ErrorDelay = TimeSpan.FromSeconds(15);

    public VehicleTrackingBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<VehicleTrackingBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 VehicleTrackingBackgroundService iniciado");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<TrackFleetDbContext>();

                // ⚠️ Exemplo seguro: apenas leitura leve
                var activeVehicles = await db.Vehicles
                    .AsNoTracking()
                    .Where(v => v.IsActive)
                    .Select(v => v.Id)
                    .ToListAsync(stoppingToken);

                _logger.LogDebug(
                    "📡 Tracking ativo para {Count} veículos",
                    activeVehicles.Count
                );

                await Task.Delay(LoopDelay, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Encerramento gracioso
                _logger.LogInformation("🛑 VehicleTrackingBackgroundService finalizado");
                break;
            }
            catch (Exception ex)
            {
                // 🔥 ERRO NÃO DERRUBA A API
                _logger.LogError(
                    ex,
                    "❌ Erro no VehicleTrackingBackgroundService. Tentando novamente em {Delay}s",
                    ErrorDelay.TotalSeconds
                );

                try
                {
                    await Task.Delay(ErrorDelay, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }
        }
    }
}
