using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class Document
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        [Required]
        public required string Name { get; set; }

        [BsonElement("price")]
        [Required]
        public decimal Price { get; set; }

        [BsonElement("requirements")]
        public List<string> Requirements { get; set; } = new List<string>();

        [BsonElement("status")]
        public string Status { get; set; } = "Active"; // Active | Inactive

        [BsonElement("processingTime")]
        [Required]
        public required string ProcessingTime { get; set; }

        [BsonElement("templateUrl")]
        [Required]
        public required string TemplateUrl { get; set; }

        [BsonElement("totalRequests")]
        public int TotalRequests { get; set; } = 0;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("lastModified")]
        public string LastModified { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    }
}
