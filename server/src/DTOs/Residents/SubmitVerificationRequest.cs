using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Residents
{
    public class SubmitVerificationRequest
    {
        [Required(ErrorMessage = "Street/Purok is required")]
        public required string StreetPurok { get; set; }

        [Required(ErrorMessage = "House number/unit is required")]
        public required string HouseNumberUnit { get; set; }
        [Required(ErrorMessage = "Government ID front is required")]
        public required string GovernmentIdFront { get; set; }

        [Required(ErrorMessage = "Government ID back is required")]
        public required string GovernmentIdBack { get; set; }

        [Required(ErrorMessage = "Proof of residency is required")]
        public required string ProofOfResidency { get; set; }

    }
}
