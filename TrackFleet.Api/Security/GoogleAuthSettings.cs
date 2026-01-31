using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Api.Security;

/// <summary>
/// Configurações de autenticação Google OAuth.
/// Usadas exclusivamente para validação do id_token no backend.
/// </summary>
public class GoogleAuthSettings
{
    /// <summary>
    /// ClientId do Google OAuth (Web ou Android).
    /// Deve corresponder exatamente ao audience do id_token.
    /// </summary>
    [Required]
    public string ClientId { get; set; } = string.Empty;
}
