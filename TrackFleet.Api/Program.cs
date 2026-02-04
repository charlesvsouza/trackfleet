using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using TrackFleet.Api.Hubs;
using TrackFleet.Api.Security; // <--- Onde está o JwtTenantProvider
using TrackFleet.Api.Workers;
using TrackFleet.Domain.Security; // <--- Onde está a Interface ITenantProvider
using TrackFleet.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// CONFIGURAÇÃO
// ======================================================
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// ======================================================
// LOGS
// ======================================================
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// ======================================================
// JWT
// ======================================================
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["SecretKey"];
var issuer = jwtSection["Issuer"];
var audience = jwtSection["Audience"];

if (string.IsNullOrEmpty(secretKey)) throw new Exception("JWT SecretKey não encontrada!");

// ======================================================
// SERVICES
// ======================================================
builder.Services.AddHttpContextAccessor(); // Essencial para o TenantProvider
builder.Services.AddSingleton<JwtTokenGenerator>();

// 🔥 CORREÇÃO: REGISTRANDO O TENANT PROVIDER
builder.Services.AddScoped<ITenantProvider, JwtTenantProvider>();

builder.Services.AddSignalR();
builder.Services.AddHostedService<TcpGpsListener>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<TrackFleetDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/tracking"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

// ======================================================
// PIPELINE
// ======================================================
app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TrackingHub>("/tracking");

app.MapGet("/", () => "TrackFleet API Online 🚀");

// ======================================================
// DATABASE SEED
// ======================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<TrackFleetDbContext>();
        DbInitializer.Initialize(context);
        Log.Information("✅ Banco de dados inicializado e verificado!");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "❌ Erro ao inicializar o banco de dados.");
    }
}

app.Run();