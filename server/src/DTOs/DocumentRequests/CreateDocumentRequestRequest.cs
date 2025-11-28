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

    // Document format (hardcopy or softcopy) - Optional, mainly for online payments
    [RegularExpression("^(hardcopy|softcopy)$", ErrorMessage = "Document format must be either 'hardcopy' or 'softcopy'")]
    public string? DocumentFormat { get; set; }

    // For online payments - Cloudinary URL of payment proof (GCash screenshot)
    public string? PaymentProof { get; set; }

    // For online payments - GCash reference number (numbers only)
    [RegularExpression(@"^\d+$", ErrorMessage = "Reference number must contain only numbers")]
    public string? PaymentReferenceNumber { get; set; }

    // Supporting documents (e.g., valid IDs, requirements)
    public List<string>? SupportingDocuments { get; set; }

    // Optional: Staff/Admin creating on behalf of resident
    public string? CreatedBy { get; set; }
}
