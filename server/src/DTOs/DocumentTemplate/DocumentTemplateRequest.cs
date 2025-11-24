using System.ComponentModel.DataAnnotations;

namespace Server.DTOs.DocumentTemplate
{
    public class DocumentTemplateRequest
    {
        [Required(ErrorMessage = "Document type is required")]
        public required string DocumentType { get; set; }

        [Required(ErrorMessage = "Template name is required")]
        [MinLength(3, ErrorMessage = "Template name must be at least 3 characters")]
        public required string TemplateName { get; set; }

        [Required(ErrorMessage = "Template URL is required")]
        [Url(ErrorMessage = "Invalid template URL")]
        public required string TemplateUrl { get; set; }
    }
}
