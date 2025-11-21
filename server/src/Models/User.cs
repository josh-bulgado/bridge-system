using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
  [BsonIgnoreExtraElements]
  public class User
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("email")]
    [Required, EmailAddress]
    public required string Email { get; set; }

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty; // Empty for Google auth users

    [BsonElement("role")]
    public string Role { get; set; } = "resident"; // resident | staff | admin

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("isEmailVerified")]
    public bool IsEmailVerified { get; set; } = false;

    [BsonElement("emailVerifiedAt")]
    public DateTime? EmailVerifiedAt { get; set; }

    [BsonElement("emailVerificationOtp")]
    public string? EmailVerificationOtp { get; set; }

    [BsonElement("otpExpiresAt")]
    public DateTime? OtpExpiresAt { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("residentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ResidentId { get; set; }

    [BsonElement("authProvider")]
    public string AuthProvider { get; set; } = "local"; // local | google

    [BsonElement("googleId")]
    public string? GoogleId { get; set; }
  }
}
