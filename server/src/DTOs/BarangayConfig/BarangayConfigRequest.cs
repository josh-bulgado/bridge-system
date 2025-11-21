using System.ComponentModel.DataAnnotations;

namespace server.DTOs.BarangayConfig
{
    public class BarangayConfigRequest
    {
        [Required]
        public required AddressDto Address { get; set; }

        [Required]
        public required ContactDto Contact { get; set; }

        [Required]
        public required string OfficeHours { get; set; }
    }

    public class AddressDto
    {
        [Required]
        public required string RegionCode { get; set; }

        [Required]
        public required string RegionName { get; set; }

        [Required]
        public required string ProvinceCode { get; set; }

        [Required]
        public required string ProvinceName { get; set; }

        [Required]
        public required string MunicipalityCode { get; set; }

        [Required]
        public required string MunicipalityName { get; set; }

        [Required]
        public required string BarangayCode { get; set; }

        [Required]
        public required string BarangayName { get; set; }
    }

    public class ContactDto
    {
        [Required]
        [RegularExpression(@"^(\+63|0)?[0-9]{10}$", ErrorMessage = "Please enter a valid Philippine phone number")]
        public required string Phone { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}