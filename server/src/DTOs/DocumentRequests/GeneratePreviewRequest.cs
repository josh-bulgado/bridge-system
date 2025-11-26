namespace server.DTOs.DocumentRequests;

public class GeneratePreviewResponse
{
    public Dictionary<string, string> PreviewData { get; set; } = new();
    public string DocumentRequestId { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
}
