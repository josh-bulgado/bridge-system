using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class ResendOtpRequest
  {
    [Required, EmailAddress]
    public required string Email { get; set; }
  }
}
