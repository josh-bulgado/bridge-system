using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Staff
{
    public class UpdateStaffRequest
    {
        [EmailAddress]
        public string? Email { get; set; }

        public string? Role { get; set; }

        public bool? IsActive { get; set; }

        public bool? IsEmailVerified { get; set; }
    }
}
