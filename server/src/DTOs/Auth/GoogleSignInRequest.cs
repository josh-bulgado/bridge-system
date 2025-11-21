using System.ComponentModel.DataAnnotations;

namespace server.DTOs.Auth
{
  public class GoogleSignInRequest
  {
    [Required]
    public required string IdToken { get; set; }
  }
}
