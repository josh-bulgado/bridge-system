namespace server.DTOs.DocumentRequests;

public class DocumentRequestResponse
{
    public string Id { get; set; } = string.Empty;
    public string TrackingNumber { get; set; } = string.Empty;

    // Resident Information (populated)
    public string ResidentId { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string ResidentEmail { get; set; } = string.Empty;

    // Document Information (populated)
    public string DocumentId { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;

    // Request Details
    public string Purpose { get; set; } = string.Empty;
    public string? AdditionalDetails { get; set; }

    // Payment Information
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? PaymentProof { get; set; }
    public string? PaymentReferenceNumber { get; set; }
    public List<string>? SupportingDocuments { get; set; }
    public string? PaymentVerifiedBy { get; set; }
    public string? PaymentVerifiedByName { get; set; }
    public DateTime? PaymentVerifiedAt { get; set; }

    // Status
    public string Status { get; set; } = string.Empty;
    public List<StatusHistoryResponse> StatusHistory { get; set; } = new();

    // Review Information
    public string? ReviewedBy { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }

    // Document Generation
    public string? GeneratedDocumentUrl { get; set; }
    public string? GeneratedBy { get; set; }
    public string? GeneratedByName { get; set; }
    public DateTime? GeneratedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class StatusHistoryResponse
{
    public string Status { get; set; } = string.Empty;
    public string? ChangedBy { get; set; }
    public string? ChangedByName { get; set; }
    public DateTime ChangedAt { get; set; }
    public string? Reason { get; set; }
    public string? Notes { get; set; }
}
