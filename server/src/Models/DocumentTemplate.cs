using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    [BsonIgnoreExtraElements]
    public class DocumentTemplate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("documentType")]
        [Required]
        public required string DocumentType { get; set; }

        [BsonElement("templateName")]
        [Required]
        public required string TemplateName { get; set; }

        [BsonElement("templateUrl")]
        [Required]
        public required string TemplateUrl { get; set; }

        [BsonElement("isActive")]
        public bool IsActive { get; set; } = true;

        [BsonElement("version")]
        public int Version { get; set; } = 1;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("createdBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CreatedBy { get; set; }
    }
}
