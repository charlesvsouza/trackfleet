using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;

using TrackFleet.Api.Hubs;
using TrackFleet.Api.Security;
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
// BLINDAGEM DE BACKGROUND SERVICES 🔒
// ======================================================

builder.Services.Configure<HostOptions>(options =>
{
    options.BackgroundServiceExceptionBehavior =
        BackgroundServiceExceptionBehavior.Ignore;
});

// ======================================================
// JWT SETTINGS + BLINDAGEM 🔐
// ======================================================

// Bind explícito
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

// Fail-fast de configuração
var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

if (jwtConfig is null ||
    string.IsNullOrWhiteSpace(jwtConfig.SecretKey) ||
    string.IsNullOrWhiteSpace(jwtConfig.Issuer) ||
    string.IsNullOrWhiteSpace(jwtConfig.Audience) ||
    jwtConfig.ExpirationMinutes <= 0)
{
    throw new InvalidOperationException(
        "JWT configuration is invalid. Check appsettings.json / appsettings.Development.json"
    );
}

// ======================================================
// CORE
// ======================================================

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, JwtTenantProvider>();
builder.Services.AddScoped<GoogleTokenValidator>();

builder.Services.AddSingleton<JwtTokenGenerator>();

// ======================================================
// TRACKING
// ======================================================

builder.Services.AddSingleton<VehiclePositionSimulator>();
builder.Services.AddHostedService<VehicleTrackingBackgroundService>();

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
            context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
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
// HEALTH CHECKS
// ======================================================

builder.Services.AddHealthChecks();

// ======================================================
// CONTROLLERS + AUTH GLOBAL
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
// JWT AUTH
// ======================================================

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtConfig!.Issuer,
            ValidAudience = jwtConfig.Audience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig.SecretKey)
            ),

            NameClaimType = JwtRegisteredClaimNames.Sub,
            RoleClaimType = ClaimTypes.Role
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
// DB INIT (DEV ONLY)
// ======================================================

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<TrackFleetDbContext>();
    await DbInitializer.InitializeAsync(db);
}

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
