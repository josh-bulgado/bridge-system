using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
  public class RegisterRequest
  {
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]+$", ErrorMessage = "First name can only contain letters, spaces, hyphens, and apostrophes")]
    public string FirstName { get; set; } = string.Empty;
    
    [StringLength(50, ErrorMessage = "Middle name must not exceed 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]*$", ErrorMessage = "Middle name can only contain letters, spaces, hyphens, and apostrophes")]
    public string? MiddleName { get; set; }
    
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]+$", ErrorMessage = "Last name can only contain letters, spaces, hyphens, and apostrophes")]
    public string LastName { get; set; } = string.Empty;
    
    [StringLength(10, ErrorMessage = "Extension must not exceed 10 characters")]
    [RegularExpression(@"^[a-zA-Z.\s]*$", ErrorMessage = "Extension can only contain letters, dots, and spaces")]
    public string? Extension { get; set; }

    [Required] public string DateOfBirth { get; set; } = string.Empty;
    [Required, Phone] public string ContactNumber { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    
    [Required]
    [RegularExpression(@"^(Single|Married|Widowed|Divorced|Separated)$", 
        ErrorMessage = "Civil status must be one of: Single, Married, Widowed, Divorced, Separated")]
    public string CivilStatus { get; set; } = string.Empty;
    
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
        ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
    public string Password { get; set; } = string.Empty;

    // Honeypot field - should be left empty by real users
    public string? Website { get; set; }
  }
}
