using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class ForgotPasswordRequest
  {
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public required string Email { get; set; }
  }
}
