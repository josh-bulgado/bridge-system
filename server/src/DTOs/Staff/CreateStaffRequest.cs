using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Staff
{
    public class CreateStaffRequest
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public required string Role { get; set; } // "admin" or "staff"

        public bool IsActive { get; set; } = true;
    }
}
