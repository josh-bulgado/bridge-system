using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    [BsonIgnoreExtraElements]
    public class BarangayConfig
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("barangayCaptain")]
        [Required]
        public required string BarangayCaptain { get; set; }

        [BsonElement("logoUrl")]
        [Required]
        public required string LogoUrl { get; set; }

        [BsonElement("address")]
        [Required]
        public required BarangayAddress Address { get; set; }

        [BsonElement("contact")]
        [Required]
        public required BarangayContact Contact { get; set; }

        [BsonElement("officeHours")]
        [Required]
        public required string OfficeHours { get; set; }

        // GCash Payment Information
        [BsonElement("gcashNumber")]
        public string? GcashNumber { get; set; }

        [BsonElement("gcashAccountName")]
        public string? GcashAccountName { get; set; }

        [BsonElement("gcashQrCodeUrl")]
        public string? GcashQrCodeUrl { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    [BsonIgnoreExtraElements]
    public class BarangayAddress
    {
        [BsonElement("regionCode")]
        [Required]
        public required string RegionCode { get; set; }

        [BsonElement("regionName")]
        [Required]
        public required string RegionName { get; set; }

        [BsonElement("provinceCode")]
        [Required]
        public required string ProvinceCode { get; set; }

        [BsonElement("provinceName")]
        [Required]
        public required string ProvinceName { get; set; }

        [BsonElement("municipalityCode")]
        [Required]
        public required string MunicipalityCode { get; set; }

        [BsonElement("municipalityName")]
        [Required]
        public required string MunicipalityName { get; set; }

        [BsonElement("barangayCode")]
        [Required]
        public required string BarangayCode { get; set; }

        [BsonElement("barangayName")]
        [Required]
        public required string BarangayName { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class BarangayContact
    {
        [BsonElement("phone")]
        [Required]
        public required string Phone { get; set; }

        [BsonElement("email")]
        [Required, EmailAddress]
        public required string Email { get; set; }
    }
}