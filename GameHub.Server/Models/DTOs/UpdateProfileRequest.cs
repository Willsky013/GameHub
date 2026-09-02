namespace GameHub.Server.Models.DTOs
{
    // DTO: UpdateProfileRequest
    // - Used to change display name, email and optionally password for the current user
    public class UpdateProfileRequest
    {
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CurrentPassword { get; set; } = string.Empty;
        public string? NewPassword { get; set; }
    }
}
