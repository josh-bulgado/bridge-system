using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

public class DocumentRequest
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("trackingNumber")]
    public string TrackingNumber { get; set; } = string.Empty;

    // References
    [BsonElement("residentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ResidentId { get; set; } = string.Empty;

    [BsonElement("documentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string DocumentId { get; set; } = string.Empty;

    // Request Details
    [BsonElement("purpose")]
    public string Purpose { get; set; } = string.Empty;

    [BsonElement("additionalDetails")]
    public string? AdditionalDetails { get; set; }

    // Status Management
    [BsonElement("status")]
    public string Status { get; set; } = "pending"; // pending, approved, rejected, payment_pending, payment_verified, ready_for_generation, completed

    [BsonElement("statusHistory")]
    public List<StatusHistory> StatusHistory { get; set; } = new();

    // Payment Info
    [BsonElement("paymentMethod")]
    public string PaymentMethod { get; set; } = "online"; // online, walkin

    [BsonElement("amount")]
    public decimal Amount { get; set; }

    [BsonElement("paymentProof")]
    public string? PaymentProof { get; set; } // Cloudinary URL for online payments (GCash screenshot)

    [BsonElement("paymentReferenceNumber")]
    public string? PaymentReferenceNumber { get; set; } // GCash reference number for online payments

    [BsonElement("supportingDocuments")]
    public List<string>? SupportingDocuments { get; set; } // List of Cloudinary URLs for supporting documents

    [BsonElement("paymentVerifiedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? PaymentVerifiedBy { get; set; }

    [BsonElement("paymentVerifiedAt")]
    public DateTime? PaymentVerifiedAt { get; set; }

    // Approval/Rejection
    [BsonElement("reviewedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ReviewedBy { get; set; }

    [BsonElement("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }

    [BsonElement("rejectionReason")]
    public string? RejectionReason { get; set; }

    [BsonElement("notes")]
    public string? Notes { get; set; }

    // Document Generation
    [BsonElement("generatedDocumentUrl")]
    public string? GeneratedDocumentUrl { get; set; }

    [BsonElement("generatedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? GeneratedBy { get; set; }

    [BsonElement("generatedAt")]
    public DateTime? GeneratedAt { get; set; }

    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }

    // Timestamps
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("submittedAt")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}

public class StatusHistory
{
    [BsonElement("status")]
    public string Status { get; set; } = string.Empty;

    [BsonElement("changedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ChangedBy { get; set; }

    [BsonElement("changedAt")]
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("reason")]
    public string? Reason { get; set; }

    [BsonElement("notes")]
    public string? Notes { get; set; }
}
