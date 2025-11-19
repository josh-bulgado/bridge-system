using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class DocumentRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("requestNumber")]
        public string RequestNumber { get; set; } = string.Empty; // e.g., REQ-2024-001

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        [Required]
        public required string UserId { get; set; }

        [BsonElement("residentId")]
        [BsonRepresentation(BsonType.ObjectId)]
        [Required]
        public required string ResidentId { get; set; }

        // Document Type Information
        [BsonElement("documentType")]
        [Required]
        public required string DocumentType { get; set; } // e.g., "Barangay Clearance", "Certificate of Residency"

        [BsonElement("purpose")]
        [Required]
        public required string Purpose { get; set; } // Purpose of the document

        [BsonElement("quantity")]
        public int Quantity { get; set; } = 1;

        // Status Information
        [BsonElement("status")]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Action Required, Ready for Pickup, Completed, Rejected

        [BsonElement("statusHistory")]
        public List<StatusHistory> StatusHistory { get; set; } = new List<StatusHistory>();

        // Payment Information
        [BsonElement("paymentRequired")]
        public bool PaymentRequired { get; set; } = false;

        [BsonElement("paymentAmount")]
        public decimal? PaymentAmount { get; set; }

        [BsonElement("paymentStatus")]
        public string PaymentStatus { get; set; } = "Not Required"; // Not Required, Pending, Paid, Verified

        [BsonElement("paymentProofUrl")]
        public string? PaymentProofUrl { get; set; }

        [BsonElement("paymentVerifiedBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? PaymentVerifiedBy { get; set; }

        [BsonElement("paymentVerifiedAt")]
        public DateTime? PaymentVerifiedAt { get; set; }

        // Additional Documents/Requirements
        [BsonElement("requiredDocuments")]
        public List<string>? RequiredDocuments { get; set; } // List of required documents

        [BsonElement("uploadedDocuments")]
        public List<UploadedDocument>? UploadedDocuments { get; set; }

        // Processing Information
        [BsonElement("assignedTo")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AssignedTo { get; set; } // Staff member assigned to process

        [BsonElement("processedBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? ProcessedBy { get; set; }

        [BsonElement("processedAt")]
        public DateTime? ProcessedAt { get; set; }

        [BsonElement("notes")]
        public string? Notes { get; set; } // Internal notes for staff

        [BsonElement("rejectionReason")]
        public string? RejectionReason { get; set; }

        // Pickup Information
        [BsonElement("pickupSchedule")]
        public DateTime? PickupSchedule { get; set; }

        [BsonElement("pickedUpAt")]
        public DateTime? PickedUpAt { get; set; }

        [BsonElement("pickedUpBy")]
        public string? PickedUpBy { get; set; } // Name of person who picked up

        // Timestamps
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class StatusHistory
    {
        [BsonElement("status")]
        public required string Status { get; set; }

        [BsonElement("changedBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? ChangedBy { get; set; }

        [BsonElement("changedAt")]
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("comment")]
        public string? Comment { get; set; }
    }

    public class UploadedDocument
    {
        [BsonElement("documentName")]
        public required string DocumentName { get; set; }

        [BsonElement("documentUrl")]
        public required string DocumentUrl { get; set; }

        [BsonElement("uploadedAt")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
