using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Documents
{
    public class UpdateDocumentRequest
    {
        [MinLength(3, ErrorMessage = "Document name must be at least 3 characters")]
        public string? Name { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
        public decimal? Price { get; set; }

        [MinLength(1, ErrorMessage = "Processing time is required")]
        public string? ProcessingTime { get; set; }

        [RegularExpression("^(Active|Inactive)$", ErrorMessage = "Status must be either 'Active' or 'Inactive'")]
        public string? Status { get; set; }

        [MinLength(1, ErrorMessage = "At least one requirement is needed")]
        public List<string>? Requirements { get; set; }
    }
}
