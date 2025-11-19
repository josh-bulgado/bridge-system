using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class DocumentType
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        [Required]
        public required string Name { get; set; } // e.g., "Barangay Clearance"

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("code")]
        [Required]
        public required string Code { get; set; } // e.g., "BC", "CR", "BP"

        [BsonElement("category")]
        public string Category { get; set; } = "Certificate"; // Certificate, Clearance, Permit, ID

        [BsonElement("basePrice")]
        public decimal BasePrice { get; set; } = 0;

        [BsonElement("processingTime")]
        public int ProcessingTime { get; set; } = 3; // Days

        [BsonElement("requiredDocuments")]
        public List<string> RequiredDocuments { get; set; } = new List<string>();

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("requiresVerification")]
        public bool RequiresVerification { get; set; } = true; // Requires resident verification

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
