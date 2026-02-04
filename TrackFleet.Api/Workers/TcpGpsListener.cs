using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Text;
using Microsoft.AspNetCore.SignalR; // <--- Novo
using Microsoft.EntityFrameworkCore;
using TrackFleet.Api.Hubs;          // <--- Novo
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Workers;

public class TcpGpsListener : BackgroundService
{
    private readonly ILogger<TcpGpsListener> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<TrackingHub> _hubContext; // <--- Injeção do Hub
    private const int Port = 5000;

    // Construtor atualizado
    public TcpGpsListener(
        ILogger<TcpGpsListener> logger,
        IServiceScopeFactory scopeFactory,
        IHubContext<TrackingHub> hubContext) // <--- Recebe o Hub
    {
        _logger = logger;
        _scopeFactory = scopeFactory;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var listener = new TcpListener(IPAddress.Any, Port);
        listener.Start();

        _logger.LogInformation($"🚀 Servidor TCP de Rastreamento INICIADO na porta {Port}");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var client = await listener.AcceptTcpClientAsync(stoppingToken);
                _ = HandleDeviceAsync(client, stoppingToken);
            }
            catch (Exception) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao aceitar conexão TCP");
            }
        }

        listener.Stop();
    }

    private async Task HandleDeviceAsync(TcpClient client, CancellationToken token)
    {
        var endPoint = client.Client.RemoteEndPoint;
        // _logger.LogInformation($"🔌 Conectado: {endPoint}"); // Comentei para não poluir o log

        try
        {
            using var stream = client.GetStream();
            var buffer = new byte[1024];

            while (client.Connected && !token.IsCancellationRequested)
            {
                int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, token);
                if (bytesRead == 0) break;

                var data = Encoding.ASCII.GetString(buffer, 0, bytesRead).Trim();
                // _logger.LogInformation($"📦 Recebido: {data}");

                await ProcessDataAsync(data);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro na conexão {endPoint}: {ex.Message}");
        }
        finally
        {
            client.Close();
        }
    }

    private async Task ProcessDataAsync(string rawData)
    {
        try
        {
            var parts = rawData.Split(';');
            if (parts.Length < 5) return;

            var imei = parts[1];
            var latString = parts.FirstOrDefault(p => p.StartsWith("Lat:"))?.Replace("Lat:", "") ?? "0";
            var lonString = parts.FirstOrDefault(p => p.StartsWith("Lon:"))?.Replace("Lon:", "") ?? "0";
            var speedString = parts.FirstOrDefault(p => p.StartsWith("Speed:"))?.Replace("Speed:", "") ?? "0";

            double lat = double.Parse(latString, CultureInfo.InvariantCulture);
            double lon = double.Parse(lonString, CultureInfo.InvariantCulture);
            double speed = double.Parse(speedString, CultureInfo.InvariantCulture);

            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<TrackFleetDbContext>();

            var vehicle = await context.Vehicles
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Imei == imei);

            if (vehicle == null) return;

            var position = new Position
            {
                Id = Guid.NewGuid(),
                VehicleId = vehicle.Id,
                Latitude = lat,
                Longitude = lon,
                Speed = speed,
                Ignition = true,
                Timestamp = DateTime.UtcNow,
                ReceivedAt = DateTime.UtcNow
            };

            context.Positions.Add(position);
            await context.SaveChangesAsync();

            // 🔥 O PULO DO GATO: Avisa o Frontend em Tempo Real!
            await _hubContext.Clients.All.SendAsync("ReceivePosition", new
            {
                vehicleId = vehicle.Id,
                imei = vehicle.Imei,
                name = vehicle.Name,
                lat = position.Latitude,
                lng = position.Longitude,
                speed = position.Speed,
                ignition = position.Ignition,
                timestamp = position.Timestamp
            });

            _logger.LogInformation($"✅ {vehicle.Name} -> Posição Atualizada e enviada para o Mapa!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar pacote.");
        }
    }
}