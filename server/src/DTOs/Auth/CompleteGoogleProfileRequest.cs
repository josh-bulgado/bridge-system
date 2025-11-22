using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class CompleteGoogleProfileRequest
  {
    public required string IdToken { get; set; }
    
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]+$", ErrorMessage = "First name can only contain letters, spaces, hyphens, and apostrophes")]
    public required string FirstName { get; set; }
    
    [StringLength(50, ErrorMessage = "Middle name must not exceed 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]*$", ErrorMessage = "Middle name can only contain letters, spaces, hyphens, and apostrophes")]
    public string? MiddleName { get; set; }
    
    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s'\-]+$", ErrorMessage = "Last name can only contain letters, spaces, hyphens, and apostrophes")]
    public required string LastName { get; set; }
    
    [StringLength(10, ErrorMessage = "Extension must not exceed 10 characters")]
    [RegularExpression(@"^[a-zA-Z.\s]*$", ErrorMessage = "Extension can only contain letters, dots, and spaces")]
    public string? Extension { get; set; }
    
    public required string DateOfBirth { get; set; }
    public required string ContactNumber { get; set; }
  }
}
