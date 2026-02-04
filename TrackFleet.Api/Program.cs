using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using TrackFleet.Api.Hubs;          // <--- Importante
using TrackFleet.Api.Security;
using TrackFleet.Api.Workers;
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
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<JwtTokenGenerator>();

// 🔥 ONDE O ERRO ESTAVA: Faltava adicionar o SignalR aqui!
builder.Services.AddSignalR();

builder.Services.AddHostedService<TcpGpsListener>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Ajuste se seu frontend rodar em outra porta
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // SignalR exige AllowCredentials
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

        // Configuração especial para SignalR (passa o token na URL)
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

// 🔥 E faltava mapear a rota do Hub aqui!
app.MapHub<TrackingHub>("/tracking");

app.MapGet("/", () => "TrackFleet API Online 🚀");

app.Run();