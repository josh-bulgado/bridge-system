namespace server.DTOs.Auth
{
  public class GoogleSignInCheckResponse
  {
    public required string Status { get; set; } // "SUCCESS", "NEEDS_COMPLETION", "ERROR"
    public string? Message { get; set; }
    public object? Data { get; set; }
  }
}
