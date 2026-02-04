using System;
using System.Text.Json.Serialization;

namespace TrackFleet.Domain.Entities
{
    public class Driver
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty;

        // Email do Google usado para login
        public string Email { get; set; } = string.Empty;

        public string? CNH { get; set; }

        public string TenantId { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- Relacionamento Dinâmico ---
        // Se null, motorista está "a pé" (sem carro no momento)
        public Guid? CurrentVehicleId { get; set; }

        [JsonIgnore] // Evita ciclo infinito no JSON
        public Vehicle? CurrentVehicle { get; set; }
    }
}