using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
  public class RegisterRequest
  {
    [Required] public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    [Required] public string LastName { get; set; } = string.Empty;
    public string? Extension { get; set; }

    [Required] public string DateOfBirth { get; set; } = string.Empty;
    [Required, Phone] public string ContactNumber { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
  }
}
