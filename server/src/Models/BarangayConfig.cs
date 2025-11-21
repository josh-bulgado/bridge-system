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

        [BsonElement("address")]
        [Required]
        public required BarangayAddress Address { get; set; }

        [BsonElement("contact")]
        [Required]
        public required BarangayContact Contact { get; set; }

        [BsonElement("officeHours")]
        [Required]
        public required string OfficeHours { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("createdBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? CreatedBy { get; set; }

        [BsonElement("updatedBy")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UpdatedBy { get; set; }
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