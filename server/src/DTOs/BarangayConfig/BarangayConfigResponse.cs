namespace server.DTOs.BarangayConfig
{
    public class BarangayConfigResponse
    {
        public string Id { get; set; } = string.Empty;
        public string BarangayCaptain { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;
        public AddressResponse Address { get; set; } = new();
        public ContactResponse Contact { get; set; } = new();
        public string OfficeHours { get; set; } = string.Empty;
        public string? GcashNumber { get; set; }
        public string? GcashAccountName { get; set; }
        public string? GcashQrCodeUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AddressResponse
    {
        public string RegionCode { get; set; } = string.Empty;
        public string RegionName { get; set; } = string.Empty;
        public string ProvinceCode { get; set; } = string.Empty;
        public string ProvinceName { get; set; } = string.Empty;
        public string MunicipalityCode { get; set; } = string.Empty;
        public string MunicipalityName { get; set; } = string.Empty;
        public string BarangayCode { get; set; } = string.Empty;
        public string BarangayName { get; set; } = string.Empty;
    }

    public class ContactResponse
    {
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}