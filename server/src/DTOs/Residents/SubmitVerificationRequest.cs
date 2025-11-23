using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Residents
{
    public class SubmitVerificationRequest
    {
        [Required(ErrorMessage = "Street/Purok is required")]
        public required string StreetPurok { get; set; }

        [Required(ErrorMessage = "House number/unit is required")]
        public required string HouseNumberUnit { get; set; }

        [Required(ErrorMessage = "Government ID type is required")]
        public required string GovernmentIdType { get; set; }

        [Required(ErrorMessage = "Government ID front is required")]
        public required string GovernmentIdFront { get; set; }

        public string? GovernmentIdFrontUrl { get; set; }
        
        public string? GovernmentIdFrontFileType { get; set; }

        [Required(ErrorMessage = "Government ID back is required")]
        public required string GovernmentIdBack { get; set; }

        public string? GovernmentIdBackUrl { get; set; }
        
        public string? GovernmentIdBackFileType { get; set; }

        [Required(ErrorMessage = "Proof of residency type is required")]
        public required string ProofOfResidencyType { get; set; }

        [Required(ErrorMessage = "Proof of residency is required")]
        public required string ProofOfResidency { get; set; }

        public string? ProofOfResidencyUrl { get; set; }
        
        public string? ProofOfResidencyFileType { get; set; }

    }
}
