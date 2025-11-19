using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests
{
    public class CreateDocumentRequestDto
    {
        [Required]
        public required string DocumentType { get; set; }

        [Required]
        [MinLength(10)]
        public required string Purpose { get; set; }

        [Range(1, 10)]
        public int Quantity { get; set; } = 1;
    }
}
