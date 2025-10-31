using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class Resident
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // Personal Information
        [BsonElement("firstName")]
        [Required]
        public required string FirstName { get; set; }

        [BsonElement("middleName")]
        public string? MiddleName { get; set; }

        [BsonElement("lastName")]
        [Required]
        public required string LastName { get; set; }

        [BsonElement("extension")]
        [BsonIgnoreIfNull]
        public string? Extension { get; set; } // Jr., Sr., III, etc.

        [BsonElement("dateOfBirth")]
        [Required]
        public required string DateOfBirth { get; set; }

        [BsonElement("contactNumber")]
        [Required]
        [Phone]
        public required string ContactNumber { get; set; }

        // Helper property for full name
        [BsonIgnore]
        public string FullName => $"{FirstName} {MiddleName} {LastName} {Extension}".Trim().Replace("  ", " ");

        // Resident Verification
        [BsonElement("isResidentVerified")]
        public bool IsResidentVerified { get; set; } = false;

        [BsonElement("residentVerificationStatus")]
        public string ResidentVerificationStatus { get; set; } = "Pending";

        [BsonElement("verifiedBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? VerifiedBy { get; set; }

        [BsonElement("verifiedAt")]
        public DateTime? VerifiedAt { get; set; }

        [BsonElement("lastUpdated")]
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        // Optional: Address Information 
        [BsonElement("address")]
        [BsonIgnoreIfNull]
        public Address? Address { get; set; }


    }

    public class Address
    {
        [BsonElement("street")]
        public string? Street { get; set; }

        [BsonElement("barangay")]
        public string? Barangay { get; set; }

        [BsonElement("city")]
        public string? City { get; set; }

        [BsonElement("province")]
        public string? Province { get; set; }

        [BsonElement("zipCode")]
        public string? ZipCode { get; set; }
    }
}