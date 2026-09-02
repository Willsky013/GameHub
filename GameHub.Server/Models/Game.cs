namespace GameHub.Server.Models
{
    // Game model
    // - Represents a playable game in the catalog
    // - Contains identifying properties and navigation to Scores
    public class Game
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public string? Image { get; set; }
        public string? Category { get; set; }


        // Navigation: collection of scores submitted for this game
        public ICollection<Score> Scores { get; set; } = [];
    }
}
