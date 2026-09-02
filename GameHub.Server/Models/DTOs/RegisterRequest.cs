namespace GameHub.Server.Models.DTOs
{
    // DTO: RegisterRequest
    // - Sent by client to create a new user account (email, password and display name)
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string DisplayName { get; set; } = string.Empty;
    }
}
