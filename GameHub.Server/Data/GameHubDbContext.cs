// GameHubDbContext
// - Application EF Core DbContext including Identity tables and application entities (Games, Scores)
// - Configures indexes and relationships between Score, Game and ApplicationUser
using GameHub.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GameHub.Server.Data
{
    public class GameHubDbContext : IdentityDbContext<ApplicationUser>
    {
        public GameHubDbContext(
            DbContextOptions<GameHubDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Score> Scores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Game>()
                .HasIndex(game => game.Slug)
                .IsUnique();

            modelBuilder.Entity<Score>()
                .HasOne(score => score.Game)
                .WithMany(game => game.Scores)
                .HasForeignKey(score => score.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Score>()
                .HasOne(score => score.User)
                .WithMany(user => user.Scores)
                .HasForeignKey(score => score.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
