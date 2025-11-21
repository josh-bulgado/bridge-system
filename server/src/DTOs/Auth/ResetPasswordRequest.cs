using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class ResetPasswordRequest
  {
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "OTP is required.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits.")]
    public required string Otp { get; set; }

    [Required(ErrorMessage = "New password is required.")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public required string NewPassword { get; set; }
  }
}
