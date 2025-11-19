using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests
{
    public class UpdateRequestStatusDto
    {
        [Required]
        public required string Status { get; set; }

        public string? Comment { get; set; }
    }

    public class AssignRequestDto
    {
        [Required]
        public required string StaffId { get; set; }
    }

    public class UpdatePaymentStatusDto
    {
        [Required]
        public required string PaymentStatus { get; set; }
    }

    public class SchedulePickupDto
    {
        [Required]
        public required DateTime PickupDate { get; set; }
    }

    public class RejectRequestDto
    {
        [Required]
        public required string RejectionReason { get; set; }
    }
}
