using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Staff
{
    public class ToggleStaffStatusRequest
    {
        [Required]
        public required bool IsActive { get; set; }
    }
}
