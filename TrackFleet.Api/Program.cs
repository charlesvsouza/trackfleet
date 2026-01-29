using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

using TrackFleet.Api.Security;
using TrackFleet.Api.Hubs;
using TrackFleet.Api.Maps;
using TrackFleet.Api.Services;

using TrackFleet.Domain.Security;
using TrackFleet.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// =======================
// CORE SERVICES
// =======================

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, JwtTenantProvider>();

// =======================
// GPS / TRACKING
// =======================

// Simulador de GPS (memória)
builder.Services.AddSingleton<VehiclePositionSimulator>();

// Background tracking (SignalR push)
builder.Services.AddHostedService<VehicleTrackingBackgroundService>();

builder.Services.Configure<GoogleMapsSettings>(
    builder.Configuration.GetSection("GoogleMaps")
);

// =======================
// CORS (SignalR Browser)
// =======================

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

// =======================
// CONTROLLERS (AUTH GLOBAL)
// =======================

builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    options.Filters.Add(new AuthorizeFilter(policy));
});

// =======================
// DATABASE
// =======================

builder.Services.AddDbContext<TrackFleetDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Postgres")
    )
);

// =======================
// SIGNALR
// =======================

builder.Services.AddSignalR();

// =======================
// AUTH / JWT
// =======================

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

        // Token via query string para SignalR
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

// =======================
// AUTHORIZATION POLICIES
// =======================

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", p => p.RequireRole("Admin"));
    options.AddPolicy("UserOnly", p => p.RequireRole("User"));
});

// =======================
// SWAGGER
// =======================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TrackFleet API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// =======================
// APP
// =======================

var app = builder.Build();

// =======================
// DATABASE SEED
// =======================

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        var db = scope.ServiceProvider.GetRequiredService<TrackFleetDbContext>();
        // db.Database.Migrate(); // opcional
        DbInitializer.Seed(db);
        logger.LogInformation("Database seed completed.");
    }
    catch (Exception ex)
    {
        logger.LogError(
            ex,
            "Falha ao inicializar/seed do banco de dados."
        );
    }
}

// =======================
// PIPELINE
// =======================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TrackingHub>("/tracking");

app.Run();
