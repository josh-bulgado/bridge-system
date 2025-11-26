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

        [BsonElement("civilStatus")]
        public string? CivilStatus { get; set; } // Single, Married, Widowed, Divorced, Separated

        // Helper property for full name
        [BsonIgnore]
        public string FullName
        {
            get
            {
                var parts = new List<string> { FirstName };
                if (!string.IsNullOrWhiteSpace(MiddleName))
                    parts.Add(MiddleName);
                parts.Add(LastName);
                if (!string.IsNullOrWhiteSpace(Extension))
                    parts.Add(FormatExtension(Extension));
                return string.Join(" ", parts);
            }
        }

        // Helper method to format extension with proper capitalization
        private string FormatExtension(string extension)
        {
            if (string.IsNullOrWhiteSpace(extension))
                return string.Empty;

            var ext = extension.Trim().ToLower();
            
            // Handle common extensions
            return ext switch
            {
                "jr" or "jr." => "Jr.",
                "sr" or "sr." => "Sr.",
                "i" or "i." => "I",
                "ii" or "ii." => "II",
                "iii" or "iii." => "III",
                "iv" or "iv." => "IV",
                "v" or "v." => "V",
                _ => char.ToUpper(ext[0]) + ext.Substring(1) // Capitalize first letter
            };
        }

        // Resident Verification
        [BsonElement("isResidentVerified")]
        public bool IsResidentVerified { get; set; } = false;

        [BsonElement("residentVerificationStatus")]
        public string ResidentVerificationStatus { get; set; } = "Not Submitted";

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

        // Verification Documents
        [BsonElement("verificationDocuments")]
        [BsonIgnoreIfNull]
        public VerificationDocuments? VerificationDocuments { get; set; }


    }

    [BsonIgnoreExtraElements]
    public class Address
    {
        [BsonElement("street")]
        [BsonIgnoreIfNull]
        public string? Street { get; set; }

        [BsonElement("barangay")]
        [BsonIgnoreIfNull]
        public string? Barangay { get; set; }

        [BsonElement("city")]
        [BsonIgnoreIfNull]
        public string? City { get; set; }

        [BsonElement("province")]
        [BsonIgnoreIfNull]
        public string? Province { get; set; }

        [BsonElement("zipCode")]
        [BsonIgnoreIfNull]
        public string? ZipCode { get; set; }

        [BsonElement("streetPurok")]
        [BsonIgnoreIfNull]
        public string? StreetPurok { get; set; }

        [BsonElement("houseNumberUnit")]
        [BsonIgnoreIfNull]
        public string? HouseNumberUnit { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class VerificationDocuments
    {
        [BsonElement("governmentIdType")]
        public string? GovernmentIdType { get; set; }

        [BsonElement("governmentIdFront")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdFront { get; set; }

        [BsonElement("governmentIdFrontUrl")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdFrontUrl { get; set; }

        [BsonElement("governmentIdFrontFileType")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdFrontFileType { get; set; }

        [BsonElement("governmentIdBack")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdBack { get; set; }

        [BsonElement("governmentIdBackUrl")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdBackUrl { get; set; }

        [BsonElement("governmentIdBackFileType")]
        [BsonIgnoreIfNull]
        public string? GovernmentIdBackFileType { get; set; }

        [BsonElement("proofOfResidencyType")]
        public string? ProofOfResidencyType { get; set; }

        [BsonElement("proofOfResidency")]
        [BsonIgnoreIfNull]
        public string? ProofOfResidency { get; set; }

        [BsonElement("proofOfResidencyUrl")]
        [BsonIgnoreIfNull]
        public string? ProofOfResidencyUrl { get; set; }

        [BsonElement("proofOfResidencyFileType")]
        [BsonIgnoreIfNull]
        public string? ProofOfResidencyFileType { get; set; }

        [BsonElement("submittedAt")]
        [BsonIgnoreIfDefault]
        public DateTime? SubmittedAt { get; set; }
    }
}