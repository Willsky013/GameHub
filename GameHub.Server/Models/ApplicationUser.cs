using Microsoft.AspNetCore.Identity;

namespace GameHub.Server.Models
{
    // ApplicationUser model
    // - Extends IdentityUser to add display name and profile image
    // - Navigates to scores submitted by the user
    public class ApplicationUser : IdentityUser
    {
        public string? DisplayName { get; set; }
        public string? ProfileImage { get; set; }

        // Navigation: scores submitted by this user
        public ICollection<Score> Scores { get; set; } = [];
    }
}
