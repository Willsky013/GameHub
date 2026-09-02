using GameHub.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly GameHubDbContext _context;

        public GamesController(GameHubDbContext context)
        {
            _context = context;
        }

        // GetGames
        // - Returns a list of games for the public catalog
        // - Uses AsNoTracking and a projection for efficient read-only queries
        [HttpGet]
        public async Task<IActionResult> GetGames()
        {
            var games = await _context.Games
                .AsNoTracking()
                .Select(game => new
                {
                    game.Id,
                    game.Name,
                    game.Description,
                    game.Slug,
                    game.Image,
                    game.Category
                })
                .ToListAsync();

            return Ok(games);
        }

        // GetGameBySlug
        // - Returns a single game by slug, or 404 if not found
        // - Uses AsNoTracking for a read-only fetch
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetGameBySlug(string slug)
        {
            var game = await _context.Games
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.Slug == slug);

            if (game == null)
            {
                return NotFound(new
                {
                    message = "Game not found."
                });
            }

            return Ok(new
            {
                game.Id,
                game.Name,
                game.Description,
                game.Slug,
                game.Image,
                game.Category
            });
        }
    }
}