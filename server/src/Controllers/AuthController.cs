using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.DTOs;
using server.DTOs.Auth;
using BCrypt.Net;

namespace server.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly UserService _userService;
    private readonly ResidentService _residentService;
    private readonly JwtService _jwtService;
    private readonly EmailService _emailService;

    public AuthController(UserService userService, ResidentService residentService, JwtService jwtService, EmailService emailService)
    {
      _userService = userService;
      _residentService = residentService;
      _jwtService = jwtService;
      _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest dto)
    {
      // 1️⃣ Check if email already exists
      var existingUser = await _userService.GetByEmailAsync(dto.Email);
      if (existingUser != null)
        return BadRequest(new { message = "Email already registered." });

      // 2️⃣ Create Resident
      var resident = new Resident
      {
        FirstName = dto.FirstName,
        MiddleName = dto.MiddleName,
        LastName = dto.LastName,
        Extension = dto.Extension,
        DateOfBirth = dto.DateOfBirth,
        ContactNumber = dto.ContactNumber,
        IsResidentVerified = false,
        ResidentVerificationStatus = "Pending",
      };

      await _residentService.CreateAsync(resident);

      // 3️⃣ Generate OTP
      var otp = _emailService.GenerateOtp();
      var otpExpiry = DateTime.UtcNow.AddMinutes(10);

      // 4️⃣ Create User linked to Resident
      var user = new User
      {
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = "resident",
        ResidentId = resident.Id,
        IsActive = true,
        IsEmailVerified = false,
        EmailVerificationOtp = otp,
        OtpExpiresAt = otpExpiry,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
      };

      await _userService.CreateAsync(user);

      // 5️⃣ Send verification email
      var emailSent = await _emailService.SendVerificationEmailAsync(dto.Email, otp);
      if (!emailSent)
      {
        return StatusCode(500, new { message = "Registration successful but failed to send verification email. Please try resending." });
      }

      // 6️⃣ Return clean response
      return Ok(new { message = "Registration successful. Please check your email for the verification code." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] SignInRequest dto)
    {
      // 1️⃣ Check if user exists
      var user = await _userService.GetByEmailAsync(dto.Email);
      if (user == null)
        return Unauthorized(new { message = "Invalid email or password." });

      // 2️⃣ Verify password
      bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
      if (!isPasswordValid)
        return Unauthorized(new { message = "Invalid email or password." });

      // 3️⃣ Generate JWT Token
      var token = _jwtService.GenerateToken(user);

      // 4️⃣ Get resident information if user is a resident
      object userResponse;
      if (user.Role == "resident" && !string.IsNullOrEmpty(user.ResidentId))
      {
        var resident = await _residentService.GetByIdAsync(user.ResidentId);
        userResponse = new
        {
          id = user.Id,
          email = user.Email,
          role = user.Role,
          isEmailVerified = user.IsEmailVerified,
          firstName = resident?.FirstName,
          lastName = resident?.LastName,
          middleName = resident?.MiddleName,
          fullName = resident?.FullName
        };
      }
      else
      {
        userResponse = new
        {
          id = user.Id,
          email = user.Email,
          role = user.Role,
          isEmailVerified = user.IsEmailVerified
        };
      }

      // 5️⃣ Return token and user info
      return Ok(new
      {
        token,
        user = userResponse
      });
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest dto)
    {
      var isVerified = await _userService.VerifyOtpAsync(dto.Email, dto.Otp);
      
      if (!isVerified)
      {
        return BadRequest(new { message = "Invalid or expired verification code." });
      }

      return Ok(new { message = "Email verified successfully!" });
    }

    [HttpPost("resend-otp")]
    public async Task<IActionResult> ResendOtp([FromBody] ResendOtpRequest dto)
    {
      var user = await _userService.GetByEmailAsync(dto.Email);
      
      if (user == null)
      {
        return NotFound(new { message = "User not found." });
      }

      if (user.IsEmailVerified)
      {
        return BadRequest(new { message = "Email is already verified." });
      }

      // Generate new OTP
      var otp = _emailService.GenerateOtp();
      var otpExpiry = DateTime.UtcNow.AddMinutes(10);

      user.EmailVerificationOtp = otp;
      user.OtpExpiresAt = otpExpiry;
      await _userService.UpdateAsync(user.Id!, user);

      // Send verification email
      var emailSent = await _emailService.SendVerificationEmailAsync(dto.Email, otp);
      if (!emailSent)
      {
        return StatusCode(500, new { message = "Failed to send verification email. Please try again." });
      }

      return Ok(new { message = "Verification code resent successfully. Please check your email." });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest dto)
    {
      var user = await _userService.GetByEmailAsync(dto.Email);
      
      if (user == null)
      {
        // Don't reveal if email exists for security reasons
        return Ok(new { message = "If the email exists, a password reset code has been sent." });
      }

      // Generate OTP for password reset
      var otp = _emailService.GenerateOtp();
      var otpExpiry = DateTime.UtcNow.AddMinutes(10);

      user.EmailVerificationOtp = otp;
      user.OtpExpiresAt = otpExpiry;
      await _userService.UpdateAsync(user.Id!, user);

      // Send password reset email
      var emailSent = await _emailService.SendPasswordResetEmailAsync(dto.Email, otp);
      if (!emailSent)
      {
        return StatusCode(500, new { message = "Failed to send password reset email. Please try again later." });
      }

      return Ok(new { message = "If the email exists, a password reset code has been sent." });
    }

    [HttpPost("verify-reset-otp")]
    public async Task<IActionResult> VerifyResetOtp([FromBody] VerifyEmailRequest dto)
    {
      var user = await _userService.GetByEmailAsync(dto.Email);
      
      if (user == null)
      {
        Console.WriteLine($"DEBUG: User not found for email: {dto.Email}");
        return BadRequest(new { message = "Invalid or expired reset code." });
      }

      // Trim whitespace from input OTP
      var receivedOtp = dto.Otp?.Trim();
      var storedOtp = user.EmailVerificationOtp?.Trim();

      Console.WriteLine($"DEBUG: Received OTP: '{receivedOtp}' (Length: {receivedOtp?.Length})");
      Console.WriteLine($"DEBUG: Stored OTP: '{storedOtp}' (Length: {storedOtp?.Length})");
      Console.WriteLine($"DEBUG: OTP Expiry: {user.OtpExpiresAt}, Current UTC: {DateTime.UtcNow}");
      Console.WriteLine($"DEBUG: OTPs Match: {storedOtp == receivedOtp}");
      Console.WriteLine($"DEBUG: Not Expired: {user.OtpExpiresAt > DateTime.UtcNow}");

      // Check if OTP expired
      if (user.OtpExpiresAt == null || user.OtpExpiresAt <= DateTime.UtcNow)
      {
        return BadRequest(new { message = "Reset code has expired. Please request a new one." });
      }

      // Verify OTP
      if (storedOtp == receivedOtp)
      {
        return Ok(new { message = "Code verified successfully!" });
      }

      return BadRequest(new { message = "Invalid reset code. Please check and try again." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest dto)
    {
      var user = await _userService.GetByEmailAsync(dto.Email);
      
      if (user == null)
      {
        return BadRequest(new { message = "Invalid or expired reset code." });
      }

      // Hash the new password
      var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

      // Reset password with OTP verification
      var isReset = await _userService.ResetPasswordAsync(dto.Email, dto.Otp, newPasswordHash);
      
      if (!isReset)
      {
        return BadRequest(new { message = "Invalid or expired reset code." });
      }

      return Ok(new { message = "Password reset successfully! You can now login with your new password." });
    }

  }
}
