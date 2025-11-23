using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests;

public class RejectDocumentRequestRequest
{
    [Required(ErrorMessage = "Rejection reason is required")]
    [StringLength(1000, MinimumLength = 10, ErrorMessage = "Rejection reason must be between 10 and 1000 characters")]
    public string RejectionReason { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
    public string? Notes { get; set; }
}
