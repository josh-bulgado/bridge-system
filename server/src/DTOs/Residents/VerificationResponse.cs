namespace server.DTOs.Residents
{
    public class VerificationResponse
    {
        public required string Id { get; set; }
        public required string Status { get; set; }
        public required string Message { get; set; }
        public DateTime? SubmittedAt { get; set; }
    }

    public class VerificationStatusResponse
    {
        public bool IsVerified { get; set; }
        public required string Status { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public string? VerifiedBy { get; set; }
        public string? RejectionReason { get; set; }
    }
}
