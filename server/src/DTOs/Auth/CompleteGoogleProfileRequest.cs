namespace server.DTOs.Auth
{
  public class CompleteGoogleProfileRequest
  {
    public required string IdToken { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public required string LastName { get; set; }
    public string? Extension { get; set; }
    public required string DateOfBirth { get; set; }
    public required string ContactNumber { get; set; }
  }
}
