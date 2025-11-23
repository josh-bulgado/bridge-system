using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests;

public class CreateDocumentRequestRequest
{
    [Required(ErrorMessage = "Resident ID is required")]
    public string ResidentId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Document ID is required")]
    public string DocumentId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Purpose is required")]
    [StringLength(500, ErrorMessage = "Purpose cannot exceed 500 characters")]
    public string Purpose { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Additional details cannot exceed 1000 characters")]
    public string? AdditionalDetails { get; set; }

    [Required(ErrorMessage = "Payment method is required")]
    [RegularExpression("^(online|walkin)$", ErrorMessage = "Payment method must be either 'online' or 'walkin'")]
    public string PaymentMethod { get; set; } = "online";

    // For online payments - Cloudinary URL of payment proof
    public string? PaymentProof { get; set; }

    // Optional: Staff/Admin creating on behalf of resident
    public string? CreatedBy { get; set; }
}
