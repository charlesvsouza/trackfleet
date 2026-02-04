using TrackFleet.Domain.Entities;

namespace TrackFleet.Infrastructure.Data;

public static class DbInitializer
{
    public static void Initialize(TrackFleetDbContext context)
    {
        // Garante que o banco existe
        context.Database.EnsureCreated();

        // Se já tem usuário, não faz nada
        if (context.Users.Any())
        {
            return;
        }

        // Cria o Admin Padrão
        var admin = new User(
            "admin@trackfleet.com", // Email
            "Admin Master",         // Nome
            "Admin"                 // Role
        );

        // Define a senha (o método gera o hash internamente)
        admin.SetPassword("admin123");

        context.Users.Add(admin);
        context.SaveChanges();
    }
}