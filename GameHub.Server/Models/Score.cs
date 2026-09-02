using Microsoft.AspNetCore.Identity;

namespace GameHub.Server.Models
{

    public class Score
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public int GameId { get; set; }

        public int ScoreValue { get; set; }

        public DateTime CreatedAt { get; set; }

        // Navigation: user who submitted the score
        public ApplicationUser User { get; set; } = null!;
        // Navigation: game the score belongs to
        public Game Game { get; set; } = null!;
    }
}
