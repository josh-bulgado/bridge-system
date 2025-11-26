namespace server.DTOs.Residents
{
    public class ResidentListResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string LocalAddress { get; set; } = string.Empty;
        public string VerificationStatus { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime? VerifiedDate { get; set; }
        public bool HasDocuments { get; set; }
        
        // Current verification documents
        public string? GovernmentIdType { get; set; }
        public string? GovernmentIdFront { get; set; }
        public string? GovernmentIdFrontUrl { get; set; }
        public string? GovernmentIdFrontFileType { get; set; }
        public string? GovernmentIdBack { get; set; }
        public string? GovernmentIdBackUrl { get; set; }
        public string? GovernmentIdBackFileType { get; set; }
        public string? ProofOfResidencyType { get; set; }
        public string? ProofOfResidency { get; set; }
        public string? ProofOfResidencyUrl { get; set; }
        public string? ProofOfResidencyFileType { get; set; }
        public string? StreetPurok { get; set; }
        public string? HouseNumberUnit { get; set; }

        // Verification history - all previous submissions
        public List<VerificationHistoryDto>? VerificationHistory { get; set; }
    }

    public class VerificationHistoryDto
    {
        public string? GovernmentIdType { get; set; }
        public string? GovernmentIdFront { get; set; }
        public string? GovernmentIdFrontUrl { get; set; }
        public string? GovernmentIdFrontFileType { get; set; }
        public string? GovernmentIdBack { get; set; }
        public string? GovernmentIdBackUrl { get; set; }
        public string? GovernmentIdBackFileType { get; set; }
        public string? ProofOfResidencyType { get; set; }
        public string? ProofOfResidency { get; set; }
        public string? ProofOfResidencyUrl { get; set; }
        public string? ProofOfResidencyFileType { get; set; }
        public string? StreetPurok { get; set; }
        public string? HouseNumberUnit { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string? Status { get; set; }
        public string? ReviewedBy { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
