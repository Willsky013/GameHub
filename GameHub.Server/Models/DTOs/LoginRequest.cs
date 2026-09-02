namespace GameHub.Server.Models.DTOs
{
    // DTO: LoginRequest
    // - Sent from the client to authenticate a user (email + password)
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }
}
