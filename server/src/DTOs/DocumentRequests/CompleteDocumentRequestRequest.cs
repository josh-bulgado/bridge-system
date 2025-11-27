using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests;

public class CompleteDocumentRequestRequest
{
    [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
    public string? Notes { get; set; }
}
