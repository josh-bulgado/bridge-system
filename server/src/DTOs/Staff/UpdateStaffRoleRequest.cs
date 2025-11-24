using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Staff
{
    public class UpdateStaffRoleRequest
    {
        [Required]
        public required string Role { get; set; } // "admin" or "staff"
    }
}
