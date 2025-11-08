namespace server.DTOs
{
    public class SignInRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
