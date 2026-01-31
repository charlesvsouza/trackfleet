using System.ComponentModel.DataAnnotations;

namespace TrackFleet.Api.Dtos;

public class StopTrackingRequestDto
{
    /// <summary>
    /// Opcional. Se não informado, encerra a sessão ativa do usuário.
    /// </summary>
    public Guid? SessionId { get; set; }
}
