using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Documents
{
    public class ToggleDocumentStatusRequest
    {
        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Active|Inactive)$", ErrorMessage = "Status must be either 'Active' or 'Inactive'")]
        public required string Status { get; set; }
    }
}
