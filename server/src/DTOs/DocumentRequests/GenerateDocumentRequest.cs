using System.ComponentModel.DataAnnotations;

namespace server.DTOs.DocumentRequests;

public class GenerateDocumentRequest
{
    [Required]
    public Dictionary<string, string> Data { get; set; } = new();
}

public class GenerateDocumentResponse
{
    public string DocumentUrl { get; set; } = string.Empty;
    public string TrackingNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
