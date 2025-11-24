namespace Server.DTOs.DocumentTemplate
{
    public class DocumentTemplateResponse
    {
        public string Id { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public string TemplateName { get; set; } = string.Empty;
        public string TemplateUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
    }
}
