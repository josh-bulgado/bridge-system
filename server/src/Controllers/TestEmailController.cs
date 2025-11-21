using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TestEmailController : ControllerBase
  {
    private readonly EmailService _emailService;

    public TestEmailController(EmailService emailService)
    {
      _emailService = emailService;
    }

    [HttpPost("test-password-reset")]
    public async Task<IActionResult> TestPasswordReset([FromBody] TestEmailRequest request)
    {
      try
      {
        var otp = _emailService.GenerateOtp();
        Console.WriteLine($"[TEST] Generated OTP: {otp}");
        Console.WriteLine($"[TEST] Sending to: {request.Email}");
        
        var emailSent = await _emailService.SendPasswordResetEmailAsync(request.Email, otp);
        
        Console.WriteLine($"[TEST] Email sent status: {emailSent}");
        
        return Ok(new { 
          success = emailSent, 
          otp = otp, // Only for testing - remove in production!
          message = emailSent ? "Email sent successfully" : "Failed to send email"
        });
      }
      catch (Exception ex)
      {
        Console.WriteLine($"[TEST] Exception: {ex.Message}");
        Console.WriteLine($"[TEST] Stack Trace: {ex.StackTrace}");
        return StatusCode(500, new { error = ex.Message });
      }
    }
  }

  public class TestEmailRequest
  {
    public required string Email { get; set; }
  }
}
