using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackFleet.Infrastructure.Data;

namespace TrackFleet.Api.Controllers;

[Authorize] // Exige login para ver a lista
[ApiController]
[Route("users")]      // <--- Atende a rota que o Frontend chama
[Route("api/users")]  // <--- Atende o padrão de API também
public class UsersController : ControllerBase
{
    private readonly TrackFleetDbContext _context;

    public UsersController(TrackFleetDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Busca todos os usuários, sem senha, direto do banco
        var users = await _context.Users
            .AsNoTracking()
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.IsActive
            })
            .ToListAsync();

        return Ok(users);
    }
}