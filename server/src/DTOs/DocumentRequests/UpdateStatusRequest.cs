using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests;

public class UpdateStatusRequest
{
    [Required(ErrorMessage = "Status is required")]
    [RegularExpression("^(pending|approved|rejected|payment_pending|payment_verified|ready_for_generation|completed)$", 
        ErrorMessage = "Invalid status value")]
    public string Status { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Reason cannot exceed 1000 characters")]
    public string? Reason { get; set; }

    [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
    public string? Notes { get; set; }
}
