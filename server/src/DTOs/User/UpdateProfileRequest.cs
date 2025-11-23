using System.ComponentModel.DataAnnotations;

namespace server.DTOs.User
{
    public class UpdateProfileRequest
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
        
        public DateTime? DateOfBirth { get; set; }
        public string ContactNumber { get; set; } = string.Empty;
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? Barangay { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? ZipCode { get; set; }
    }
}
