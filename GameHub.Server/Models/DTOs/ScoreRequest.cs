namespace GameHub.Server.Models.DTOs
{
    // DTO: ScoreRequest
    // - Sent by the client to submit a new score for a game
    public class ScoreRequest
    {
        public int GameId { get; set; }

        public int ScoreValue { get; set; }
    }
}
