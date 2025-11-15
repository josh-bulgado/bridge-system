using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class VerifyEmailRequest
  {
    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Otp { get; set; }
  }
}
