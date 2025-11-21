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
    
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
        ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
    public string Password { get; set; } = string.Empty;

    // Honeypot field - should be left empty by real users
    public string? Website { get; set; }
  }
}
