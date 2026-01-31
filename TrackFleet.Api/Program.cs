using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;
using System.Threading.RateLimiting;

using TrackFleet.Api.Security;
using TrackFleet.Api.Hubs;
using TrackFleet.Api.Maps;
using TrackFleet.Api.Services;

using TrackFleet.Domain.Security;
using TrackFleet.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// CONFIGURAÇÃO POR AMBIENTE
// ======================================================

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile(
        $"appsettings.{builder.Environment.EnvironmentName}.json",
        optional: true,
        reloadOnChange: true)
    .AddEnvironmentVariables();

// ======================================================
// LOGS
// ======================================================

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "TrackFleet.Api")
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// ======================================================
// CORE
// ======================================================

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, JwtTenantProvider>();
builder.Services.AddScoped<GoogleTokenValidator>();

// ======================================================
// TRACKING
// ======================================================

builder.Services.AddSingleton<VehiclePositionSimulator>();
builder.Services.AddHostedService<VehicleTrackingBackgroundService>();

builder.Services.Configure<GoogleMapsSettings>(
    builder.Configuration.GetSection("GoogleMaps")
);

builder.Services.Configure<GoogleAuthSettings>(
    builder.Configuration.GetSection("GoogleAuth")
);

// ======================================================
// CORS
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

// ======================================================
// RATE LIMIT
// ======================================================

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("PositionRateLimit", context =>
    {
        var userId =
            context.User?.FindFirst("sub")?.Value ??
            context.Connection.RemoteIpAddress?.ToString() ??
            "anonymous";

        return RateLimitPartition.GetFixedWindowLimiter(
            userId,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            });
    });
});

// ======================================================
// HEALTH CHECKS  ✅ CORREÇÃO CRÍTICA
// ======================================================

builder.Services.AddHealthChecks();

// ======================================================
// CONTROLLERS
// ======================================================

builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    options.Filters.Add(new AuthorizeFilter(policy));
});

// ======================================================
// DATABASE
// ======================================================

builder.Services.AddDbContext<TrackFleetDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Postgres")
    )
);

// ======================================================
// SIGNALR
// ======================================================

builder.Services.AddSignalR();

// ======================================================
// JWT
// ======================================================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

builder.Services.AddScoped<JwtTokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration
            .GetSection("Jwt")
            .Get<JwtSettings>()!;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt.SecretKey)
            )
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/tracking"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

// ======================================================
// APP
// ======================================================

var app = builder.Build();

// ======================================================
// PIPELINE
// ======================================================

app.UseCors("DevCors");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TrackingHub>("/tracking");
app.MapHealthChecks("/health");

app.Run();
