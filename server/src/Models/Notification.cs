using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.src.Models;

public class Notification
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public required string UserId { get; set; }

    [BsonElement("title")]
    public required string Title { get; set; }

    [BsonElement("message")]
    public required string Message { get; set; }

    [BsonElement("type")]
    public string Type { get; set; } = "info"; // info, success, warning, error

    [BsonElement("category")]
    public string? Category { get; set; } // document_request, verification, payment, etc.

    [BsonElement("relatedEntityId")]
    public string? RelatedEntityId { get; set; } // e.g., document request ID

    [BsonElement("actionUrl")]
    public string? ActionUrl { get; set; } // Where to navigate when clicked

    [BsonElement("isRead")]
    public bool IsRead { get; set; } = false;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("readAt")]
    public DateTime? ReadAt { get; set; }
}
