using GameHub.Server.Data;
using GameHub.Server.Models;
using GameHub.Server.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ScoresController : ControllerBase
    {
        private readonly GameHubDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ScoresController(
            GameHubDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // SaveScore
        // - Saves a score for the authenticated user
        [HttpPost]
        public async Task<IActionResult> SaveScore(
            [FromBody] ScoreRequest request)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            var game = await _context.Games
                .FirstOrDefaultAsync(g => g.Id == request.GameId);

            if (game == null)
                return NotFound(new
                {
                    message = "Game not found."
                });

            if (request.ScoreValue < 0)
                return BadRequest(new
                {
                    message = "Score cannot be negative."
                });

            var score = new Score
            {
                UserId = user.Id,
                GameId = game.Id,
                ScoreValue = request.ScoreValue,
                CreatedAt = DateTime.UtcNow
            };

            _context.Scores.Add(score);

            await _context.SaveChangesAsync();

            var highScore = await _context.Scores
                .Where(s =>
                    s.UserId == user.Id &&
                    s.GameId == game.Id)
                .MaxAsync(s => s.ScoreValue);

            return Ok(new
            {
                message = "Score saved successfully.",
                score = score.ScoreValue,
                highScore,
                isNewHighScore = score.ScoreValue == highScore
            });
        }

        // GetGameScores
        // - Returns scores for a specific game, ordered by ScoreValue descending, then CreatedAt ascending
        [AllowAnonymous]
        [HttpGet("{gameId}")]
        public async Task<IActionResult> GetGameScores(
        int gameId,
        [FromQuery] int limit = 0)
        {
            IQueryable<Score> query = _context.Scores
                .AsNoTracking()
                .Where(score => score.GameId == gameId);

            query = query
                .OrderByDescending(score => score.ScoreValue)
                .ThenBy(score => score.CreatedAt);

            if (limit > 0)
            {
                query = query.Take(limit);
            }

            var scores = await query
                .Select(score => new
                {
                    score.ScoreValue,
                    score.GameId,
                    score.CreatedAt,
                    DisplayName = score.User.DisplayName
                        ?? score.User.UserName
                        ?? "Unknown"
                })
                .ToListAsync();

            return Ok(scores);
        }

        // GetHallOfFame
        // - Returns one top score per game (highest ScoreValue, tie broken by earlier CreatedAt)
        [AllowAnonymous]
        [HttpGet("hall-of-fame")]
        public async Task<IActionResult> GetHallOfFame()
        {
            var scores = await _context.Scores
                .AsNoTracking()
                .Where(s => !_context.Scores.Any(x => x.GameId == s.GameId &&
                    (x.ScoreValue > s.ScoreValue ||
                     (x.ScoreValue == s.ScoreValue && x.CreatedAt < s.CreatedAt))))
                .OrderBy(s => s.Game.Name)
                .Select(s => new
                {
                    gameName = s.Game.Name,
                    displayName = s.User.DisplayName ?? s.User.UserName ?? "Unknown",
                    score = s.ScoreValue,
                    createdAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(scores);
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMyScores(
    [FromQuery] int limit = 0,
    [FromQuery] int? gameId = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            IQueryable<Score> query = _context.Scores
                .AsNoTracking()
                .Where(score => score.UserId == user.Id);

            if (gameId.HasValue)
            {
                query = query.Where(
                    score => score.GameId == gameId.Value
                );
            }

            query = query
                .OrderByDescending(score => score.ScoreValue)
                .ThenBy(score => score.CreatedAt);

            if (limit > 0)
            {
                query = query.Take(limit);
            }

            var scores = await query
                .Select(score => new
                {
                    score.ScoreValue,
                    score.GameId,
                    score.CreatedAt
                })
                .ToListAsync();

            return Ok(scores);
        }
    }
}