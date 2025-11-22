using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Documents
{
    public class CreateDocumentRequest
    {
        [Required(ErrorMessage = "Document name is required")]
        [MinLength(3, ErrorMessage = "Document name must be at least 3 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Processing time is required")]
        [MinLength(1, ErrorMessage = "Processing time is required")]
        public required string ProcessingTime { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Active|Inactive)$", ErrorMessage = "Status must be either 'Active' or 'Inactive'")]
        public string Status { get; set; } = "Active";

        [Required(ErrorMessage = "At least one requirement is needed")]
        [MinLength(1, ErrorMessage = "At least one requirement is needed")]
        public required List<string> Requirements { get; set; }
    }
}
