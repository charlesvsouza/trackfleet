using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrackFleet.Domain.Entities;
using TrackFleet.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TrackFleet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Apenas Admin pode gerenciar usuários
    public class UsersController : ControllerBase
    {
        private readonly TrackFleetDbContext _context;

        public UsersController(TrackFleetDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            // 1. Validação de Email Duplicado
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email já cadastrado." });

            // 2. CORREÇÃO: Usando o construtor oficial da Entidade
            // A ordem provavelmente é (email, name, role) baseada no seu DbInitializer
            var user = new User(
                request.Email,
                request.Name,
                request.Role
            );

            // 3. Define a senha usando o método encapsulado da entidade
            user.SetPassword(request.Password);

            // 4. Salva no banco
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTO simples para receber os dados do frontend
    public record CreateUserRequest(string Name, string Email, string Password, string Role);
}