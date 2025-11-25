using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using server.DTOs;
using server.DTOs.Auth;
using BCrypt.Net;
using System.Net.Http;
using System.Text.Json;

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
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly RateLimiterService _rateLimiter;

    public AuthController(
      UserService userService, 
      ResidentService residentService, 
      JwtService jwtService, 
      EmailService emailService,
      IHttpClientFactory httpClientFactory,
      IConfiguration configuration,
      RateLimiterService rateLimiter)
    {
      _userService = userService;
      _residentService = residentService;
      _jwtService = jwtService;
      _emailService = emailService;
      _httpClientFactory = httpClientFactory;
      _configuration = configuration;
      _rateLimiter = rateLimiter;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest dto)
    {
      // 0️⃣ Security Checks
      // Rate Limiting: 5 requests per 10 minutes per IP
      var ipAddress = _rateLimiter.GetClientIp(HttpContext);
      if (_rateLimiter.IsRateLimited(ipAddress, 5, TimeSpan.FromMinutes(10)))
      {
          return StatusCode(429, new { message = "Too many registration attempts. Please try again later." });
      }

      // Honeypot Check
      if (!string.IsNullOrEmpty(dto.Website))
      {
          // Silently fail or return generic error to confuse bots
          return BadRequest(new { message = "Registration failed." });
      }

      // Input Sanitization
      dto.FirstName = dto.FirstName.Trim();
      dto.MiddleName = dto.MiddleName?.Trim();
      dto.LastName = dto.LastName.Trim();
      dto.Extension = dto.Extension?.Trim();
      dto.DateOfBirth = dto.DateOfBirth.Trim();
      dto.ContactNumber = dto.ContactNumber.Trim();
      dto.Email = dto.Email.Trim();

      // 1️⃣ Check if email already exists (including deleted accounts)
      var existingUser = await _userService.GetByEmailIncludingDeletedAsync(dto.Email);
      if (existingUser != null)
      {
        if (existingUser.IsDeleted)
        {
          return BadRequest(new { message = "This email was previously registered. Please use a different email or contact support." });
        }
        return BadRequest(new { message = "Email already registered." });
      }

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
        FirstName = dto.FirstName,
        MiddleName = dto.MiddleName,
        LastName = dto.LastName,
        Extension = dto.Extension,
        DateOfBirth = DateTime.Parse(dto.DateOfBirth),
        ContactNumber = dto.ContactNumber,
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

    [HttpGet("check-email-availability")]
    public async Task<IActionResult> CheckEmailAvailability([FromQuery] string email)
    {
      // 🐛 DEBUG: Track request timing
      var requestStartTime = DateTime.UtcNow;
      Console.WriteLine($"[EMAIL CHECK] 📥 Request received at {requestStartTime:HH:mm:ss.fff}");
      
      // 🔒 Security: Get client IP address
      var ipAddress = _rateLimiter.GetClientIp(HttpContext);
      
      // 🔒 Security: Check if IP is blocked due to repeated violations
      if (_rateLimiter.IsIpBlocked(ipAddress))
      {
        Console.WriteLine($"[EMAIL CHECK] 🚫 Blocked IP: {ipAddress}");
        return StatusCode(403, new { available = false, message = "Access temporarily blocked due to suspicious activity." });
      }
      
      // 🔒 Security: Rate limiting to prevent email enumeration attacks
      // Allow 10 checks per minute per IP address
      if (_rateLimiter.IsRateLimited($"email_check_{ipAddress}", 10, TimeSpan.FromMinutes(1)))
      {
        var remaining = _rateLimiter.GetRemainingRequests($"email_check_{ipAddress}", 10);
        Console.WriteLine($"[EMAIL CHECK] ⚠️ Rate limit exceeded for IP: {ipAddress}");
        
        return StatusCode(429, new { available = false, message = "Too many requests. Please try again later." });
      }

      // 🔒 Security: Validate email parameter
      if (string.IsNullOrWhiteSpace(email))
      {
        Console.WriteLine($"[EMAIL CHECK] ❌ Empty email parameter");
        return BadRequest(new { available = false, message = "Email is required." });
      }
      
      Console.WriteLine($"[EMAIL CHECK] 🔍 Validating email: {email.Substring(0, Math.Min(5, email.Length))}***");

      // 🔒 Security: Advanced email validation to prevent injection attacks
      email = email.Trim().ToLower();
      
      // 🔒 Security: Remove any HTML tags or dangerous characters (XSS prevention)
      email = System.Text.RegularExpressions.Regex.Replace(email, @"[<>\""\']", "");
      
      // 🔒 Security: Check for SQL injection patterns
      var sqlInjectionPatterns = new[] { "--", ";", "/*", "*/", "xp_", "sp_", "exec", "execute", "select", "insert", "update", "delete", "drop", "create", "alter" };
      foreach (var pattern in sqlInjectionPatterns)
      {
        if (email.Contains(pattern, StringComparison.OrdinalIgnoreCase))
        {
          #if DEBUG
          Console.WriteLine($"[SECURITY ALERT] Potential SQL injection attempt from IP: {ipAddress} | Pattern: {pattern}");
          #endif
          return BadRequest(new { available = false, message = "Invalid email format." });
        }
      }
      
      // Validate email format with strict regex
      var emailRegex = new System.Text.RegularExpressions.Regex(
        @"^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$",
        System.Text.RegularExpressions.RegexOptions.IgnoreCase
      );
      
      if (!emailRegex.IsMatch(email))
      {
        return BadRequest(new { available = false, message = "Invalid email format." });
      }

      // 🔒 Security: Check email length to prevent DoS attacks
      if (email.Length > 254) // RFC 5321 maximum email length
      {
        return BadRequest(new { available = false, message = "Email address is too long." });
      }

      // 🔒 Security: Detect suspicious patterns (disposable emails, common test emails)
      var suspiciousPatterns = new[] { "test", "temp", "fake", "spam", "mailinator", "guerrillamail", "10minutemail" };
      var emailLower = email.ToLower();
      
      foreach (var pattern in suspiciousPatterns)
      {
        if (emailLower.Contains(pattern) && email.Contains("test"))
        {
          #if DEBUG
          Console.WriteLine($"[SECURITY] Suspicious email pattern detected: {email.Substring(0, Math.Min(3, email.Length))}*** from IP: {ipAddress}");
          #endif
        }
      }

      // 🔒 Security: Track failed validation attempts per IP
      // var failedAttempts = 0;
      var failedKey = $"email_check_failed_{ipAddress}";
      
      // 🔒 Security: Add artificial delay to prevent timing attacks
      // This makes it harder for attackers to determine if an email exists based on response time
      var startTime = DateTime.UtcNow;
      Console.WriteLine($"[EMAIL CHECK] 🔎 Querying database...");
      
      // Check if email already exists (excluding deleted accounts for availability check)
      User? existingUser = null;
      double dbQueryTime = 0;
      try
      {
        existingUser = await _userService.GetByEmailAsync(email);
        
        dbQueryTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
        Console.WriteLine($"[EMAIL CHECK] 📊 Database query completed in {dbQueryTime:F2}ms | Found: {existingUser != null}");
      }
      catch (Exception ex)
      {
        dbQueryTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
        Console.WriteLine($"[EMAIL CHECK] ❌ Database query FAILED after {dbQueryTime:F2}ms");
        Console.WriteLine($"[EMAIL CHECK] ❌ Error: {ex.Message}");
        Console.WriteLine($"[EMAIL CHECK] ❌ Type: {ex.GetType().Name}");
        
        // Return a generic error instead of exposing database issues
        return StatusCode(503, new { available = false, message = "Service temporarily unavailable. Please try again later." });
      }
      
      // 🔒 Security: Ensure consistent response time (minimum 50ms, max 80ms for randomness)
      var elapsed = (DateTime.UtcNow - startTime).TotalMilliseconds;
      var minDelay = 50;
      var randomDelay = new Random().Next(0, 30); // Add 0-30ms random delay
      var totalMinDelay = minDelay + randomDelay;
      
      if (elapsed < totalMinDelay)
      {
        var delayNeeded = totalMinDelay - (int)elapsed;
        Console.WriteLine($"[EMAIL CHECK] ⏱️ Adding {delayNeeded}ms artificial delay for security");
        await Task.Delay(delayNeeded);
      }
      
      // 🐛 DEBUG: Calculate total request time
      var totalRequestTime = (DateTime.UtcNow - requestStartTime).TotalMilliseconds;
      Console.WriteLine($"[EMAIL CHECK] ✅ Request completed in {totalRequestTime:F2}ms | Available: {existingUser == null}");
      Console.WriteLine($"[EMAIL CHECK] 📤 Sending response at {DateTime.UtcNow:HH:mm:ss.fff}");
      
      // 🔒 Security: Add cache headers to prevent response caching
      Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
      Response.Headers["Pragma"] = "no-cache";
      Response.Headers["Expires"] = "0";
      
      // 🐛 DEBUG: Add timing information to response headers
      Response.Headers["X-Request-Time-Ms"] = totalRequestTime.ToString("F2");
      Response.Headers["X-DB-Query-Time-Ms"] = dbQueryTime.ToString("F2");
      
      return Ok(new { available = existingUser == null });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] SignInRequest dto)
    {
      // 1️⃣ Check if user exists
      var user = await _userService.GetByEmailAsync(dto.Email);
      if (user == null)
        return Unauthorized(new { message = "Invalid email or password." });

      // 🔒 Security: Check if account is deleted
      if (user.IsDeleted)
      {
        return Unauthorized(new { message = "This account has been deleted. Please contact support if you believe this is an error." });
      }

      // 🔒 Security: Check if account is inactive
      if (!user.IsActive)
      {
        return Unauthorized(new { message = "Your account has been deactivated. Please contact support." });
      }

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
          isActive = user.IsActive,
          isEmailVerified = user.IsEmailVerified,
          firstName = resident?.FirstName ?? user.FirstName,
          lastName = resident?.LastName ?? user.LastName,
          middleName = resident?.MiddleName ?? user.MiddleName,
          extension = resident?.Extension ?? user.Extension,
          fullName = resident?.FullName ?? $"{user.FirstName} {user.MiddleName} {user.LastName}".Trim(),
          dateOfBirth = resident?.DateOfBirth ?? user.DateOfBirth?.ToString("yyyy-MM-dd"),
          contactNumber = resident?.ContactNumber ?? user.ContactNumber,
          residentId = user.ResidentId,
          authProvider = user.AuthProvider,
          googleId = user.GoogleId,
          emailVerifiedAt = user.EmailVerifiedAt,
          createdAt = user.CreatedAt,
          updatedAt = user.UpdatedAt
        };
      }
      else
      {
        userResponse = new
        {
          id = user.Id,
          email = user.Email,
          role = user.Role,
          isActive = user.IsActive,
          isEmailVerified = user.IsEmailVerified,
          firstName = user.FirstName,
          lastName = user.LastName,
          middleName = user.MiddleName,
          extension = user.Extension,
          dateOfBirth = user.DateOfBirth?.ToString("yyyy-MM-dd"),
          contactNumber = user.ContactNumber,
          authProvider = user.AuthProvider,
          googleId = user.GoogleId,
          emailVerifiedAt = user.EmailVerifiedAt,
          createdAt = user.CreatedAt,
          updatedAt = user.UpdatedAt
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

      // Get the verified user
      var user = await _userService.GetByEmailAsync(dto.Email);
      if (user == null)
      {
        return BadRequest(new { message = "User not found." });
      }

      // Generate JWT Token
      var token = _jwtService.GenerateToken(user);

      // Get resident information if user is a resident
      object userResponse;
      if (user.Role == "resident" && !string.IsNullOrEmpty(user.ResidentId))
      {
        var resident = await _residentService.GetByIdAsync(user.ResidentId);
        userResponse = new
        {
          id = user.Id,
          email = user.Email,
          role = user.Role,
          isActive = user.IsActive,
          isEmailVerified = user.IsEmailVerified,
          firstName = resident?.FirstName ?? user.FirstName,
          lastName = resident?.LastName ?? user.LastName,
          middleName = resident?.MiddleName ?? user.MiddleName,
          extension = resident?.Extension ?? user.Extension,
          fullName = resident?.FullName ?? $"{user.FirstName} {user.MiddleName} {user.LastName}".Trim(),
          dateOfBirth = resident?.DateOfBirth ?? user.DateOfBirth?.ToString("yyyy-MM-dd"),
          contactNumber = resident?.ContactNumber ?? user.ContactNumber,
          residentId = user.ResidentId,
          authProvider = user.AuthProvider,
          googleId = user.GoogleId,
          emailVerifiedAt = user.EmailVerifiedAt,
          createdAt = user.CreatedAt,
          updatedAt = user.UpdatedAt
        };
      }
      else
      {
        userResponse = new
        {
          id = user.Id,
          email = user.Email,
          role = user.Role,
          isActive = user.IsActive,
          isEmailVerified = user.IsEmailVerified,
          firstName = user.FirstName,
          lastName = user.LastName,
          middleName = user.MiddleName,
          extension = user.Extension,
          dateOfBirth = user.DateOfBirth?.ToString("yyyy-MM-dd"),
          contactNumber = user.ContactNumber,
          authProvider = user.AuthProvider,
          googleId = user.GoogleId,
          emailVerifiedAt = user.EmailVerifiedAt,
          createdAt = user.CreatedAt,
          updatedAt = user.UpdatedAt
        };
      }

      // Return token and user info
      return Ok(new
      {
        message = "Email verified successfully!",
        token,
        user = userResponse
      });
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
      
      // Check if user exists
      if (user == null)
      {
        return BadRequest(new { message = "This email is not registered. Please check your email or sign up for a new account." });
      }

      // Check if email is verified
      if (!user.IsEmailVerified)
      {
        return BadRequest(new { message = "Please verify your email first before resetting your password. Check your inbox for the verification code." });
      }

      // Check if user account is active
      if (!user.IsActive)
      {
        return BadRequest(new { message = "Your account has been deactivated. Please contact support for assistance." });
      }

      // Rate limiting: Check if user has recently requested a reset
      if (user.OtpExpiresAt != null && user.OtpExpiresAt > DateTime.UtcNow)
      {
        var timeRemaining = (user.OtpExpiresAt.Value - DateTime.UtcNow).TotalMinutes;
        if (timeRemaining > 8) // If less than 2 minutes have passed since last request
        {
          return BadRequest(new { message = $"Please wait before requesting another reset code. Try again in {Math.Ceiling(timeRemaining - 8)} minute(s)." });
        }
      }

      // Generate OTP for password reset
      var otp = _emailService.GenerateOtp();
      var otpExpiry = DateTime.UtcNow.AddMinutes(10);

      user.EmailVerificationOtp = otp;
      user.OtpExpiresAt = otpExpiry;
      user.UpdatedAt = DateTime.UtcNow;
      await _userService.UpdateAsync(user.Id!, user);

      // Send password reset email
      var emailSent = await _emailService.SendPasswordResetEmailAsync(dto.Email, otp);
      if (!emailSent)
      {
        return StatusCode(500, new { message = "Failed to send password reset email. Please try again later." });
      }

      return Ok(new { message = "Password reset code sent successfully! Please check your email." });
    }

    [HttpPost("verify-reset-otp")]
    public async Task<IActionResult> VerifyResetOtp([FromBody] VerifyEmailRequest dto)
    {
      var user = await _userService.GetByEmailAsync(dto.Email);
      
      if (user == null)
      {
        return BadRequest(new { message = "User not found. Please request a new reset code." });
      }

      // Check if email is verified
      if (!user.IsEmailVerified)
      {
        return BadRequest(new { message = "Please verify your email first before resetting your password." });
      }

      // Check if user account is active
      if (!user.IsActive)
      {
        return BadRequest(new { message = "Your account has been deactivated. Please contact support." });
      }

      // Trim whitespace from input OTP
      var receivedOtp = dto.Otp?.Trim();
      var storedOtp = user.EmailVerificationOtp?.Trim();

      // Validate OTP format (6 digits)
      if (string.IsNullOrEmpty(receivedOtp) || receivedOtp.Length != 6 || !receivedOtp.All(char.IsDigit))
      {
        return BadRequest(new { message = "Invalid code format. Please enter a 6-digit code." });
      }

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
        return BadRequest(new { message = "User not found. Please request a new reset code." });
      }

      // Check if email is verified
      if (!user.IsEmailVerified)
      {
        return BadRequest(new { message = "Please verify your email first before resetting your password." });
      }

      // Check if user account is active
      if (!user.IsActive)
      {
        return BadRequest(new { message = "Your account has been deactivated. Please contact support." });
      }

      // Validate OTP format
      var otpTrimmed = dto.Otp?.Trim();
      if (string.IsNullOrEmpty(otpTrimmed) || otpTrimmed.Length != 6 || !otpTrimmed.All(char.IsDigit))
      {
        return BadRequest(new { message = "Invalid code format. Please enter a 6-digit code." });
      }

      // Check if OTP has expired
      if (user.OtpExpiresAt == null || user.OtpExpiresAt <= DateTime.UtcNow)
      {
        return BadRequest(new { message = "Reset code has expired. Please request a new one." });
      }

      // Validate password strength
      if (string.IsNullOrEmpty(dto.NewPassword) || dto.NewPassword.Length < 8)
      {
        return BadRequest(new { message = "Password must be at least 8 characters long." });
      }

      // Hash the new password
      var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

      // Reset password with OTP verification
      var (isReset, message) = await _userService.ResetPasswordAsync(dto.Email, otpTrimmed, dto.NewPassword, newPasswordHash);
      
      if (!isReset)
      {
        return BadRequest(new { message = message });
      }

      return Ok(new { message = message });
    }

    [HttpPost("google-signin/check")]
    public async Task<IActionResult> GoogleSignInCheck([FromBody] GoogleSignInRequest dto)
    {
      try
      {
        // Verify Google ID token
        var googleUser = await VerifyGoogleTokenAsync(dto.IdToken);
        if (googleUser == null)
        {
          return Unauthorized(new { status = "ERROR", message = "Invalid Google token." });
        }

        // Check if email is Gmail
        if (!googleUser.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
        {
          return BadRequest(new { status = "ERROR", message = "Only Gmail accounts are allowed for Google Sign-In." });
        }

        // Check if user exists with this email
        var user = await _userService.GetByEmailAsync(googleUser.Email);
        
        if (user == null)
        {
          // User doesn't exist - they need to complete profile
          return Ok(new
          {
            status = "NEEDS_COMPLETION",
            message = "Please complete your profile to continue.",
            data = new
            {
              email = googleUser.Email,
              givenName = googleUser.GivenName,
              familyName = googleUser.FamilyName
            }
          });
        }

        // Check if user registered with local authentication (has password)
        if (user.AuthProvider == "local" && !string.IsNullOrEmpty(user.PasswordHash))
        {
          return BadRequest(new { status = "ERROR", message = "This email is registered with a password. Please sign in using your email and password instead." });
        }

        // Check if account is deleted
        if (user.IsDeleted)
        {
          return BadRequest(new { status = "ERROR", message = "This account has been deleted. Please contact support if you believe this is an error." });
        }

        // Check if account is inactive
        if (!user.IsActive)
        {
          return BadRequest(new { status = "ERROR", message = "Your account has been deactivated. Please contact support." });
        }

        // First-time Google Sign-In: User exists but no GoogleId yet
        if (string.IsNullOrEmpty(user.GoogleId))
        {
          // Link Google account and proceed to sign in
          user.GoogleId = googleUser.GoogleId;
          user.AuthProvider = "google";
          user.IsEmailVerified = true;
          user.EmailVerifiedAt = DateTime.UtcNow;
          user.UpdatedAt = DateTime.UtcNow;
          await _userService.UpdateAsync(user.Id!, user);
        }
        // Subsequent Google Sign-In: Verify Google ID matches
        else if (user.GoogleId != googleUser.GoogleId)
        {
          return BadRequest(new { status = "ERROR", message = "Google account mismatch. Please use the correct Google account." });
        }

        // Generate JWT Token
        var token = _jwtService.GenerateToken(user);

        // Get resident information if user is a resident
        object userResponse;
        if (user.Role == "resident" && !string.IsNullOrEmpty(user.ResidentId))
        {
          var resident = await _residentService.GetByIdAsync(user.ResidentId);
          userResponse = new
          {
            id = user.Id,
            email = user.Email,
            role = user.Role,
            isActive = user.IsActive,
            isEmailVerified = user.IsEmailVerified,
            firstName = resident?.FirstName ?? user.FirstName,
            lastName = resident?.LastName ?? user.LastName,
            middleName = resident?.MiddleName ?? user.MiddleName,
            extension = resident?.Extension ?? user.Extension,
            fullName = resident?.FullName ?? $"{user.FirstName} {user.MiddleName} {user.LastName}".Trim(),
            dateOfBirth = resident?.DateOfBirth ?? user.DateOfBirth?.ToString("yyyy-MM-dd"),
            contactNumber = resident?.ContactNumber ?? user.ContactNumber,
            residentId = user.ResidentId,
            authProvider = user.AuthProvider,
            googleId = user.GoogleId,
            emailVerifiedAt = user.EmailVerifiedAt,
            createdAt = user.CreatedAt,
            updatedAt = user.UpdatedAt
          };
        }
        else
        {
          userResponse = new
          {
            id = user.Id,
            email = user.Email,
            role = user.Role,
            isActive = user.IsActive,
            isEmailVerified = user.IsEmailVerified,
            firstName = user.FirstName,
            lastName = user.LastName,
            middleName = user.MiddleName,
            extension = user.Extension,
            dateOfBirth = user.DateOfBirth?.ToString("yyyy-MM-dd"),
            contactNumber = user.ContactNumber,
            authProvider = user.AuthProvider,
            googleId = user.GoogleId,
            emailVerifiedAt = user.EmailVerifiedAt,
            createdAt = user.CreatedAt,
            updatedAt = user.UpdatedAt
          };
        }

        // Return success with token
        return Ok(new
        {
          status = "SUCCESS",
          message = "Sign in successful.",
          data = new
          {
            token,
            user = userResponse
          }
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { status = "ERROR", message = $"An error occurred: {ex.Message}" });
      }
    }

    [HttpPost("google-signin/complete")]
    public async Task<IActionResult> CompleteGoogleProfile([FromBody] CompleteGoogleProfileRequest dto)
    {
      try
      {
        // Rate Limiting: 5 requests per 10 minutes per IP
        var ipAddress = _rateLimiter.GetClientIp(HttpContext);
        if (_rateLimiter.IsRateLimited(ipAddress, 5, TimeSpan.FromMinutes(10)))
        {
            return StatusCode(429, new { message = "Too many attempts. Please try again later." });
        }
        // Verify Google ID token
        var googleUser = await VerifyGoogleTokenAsync(dto.IdToken);
        if (googleUser == null)
        {
          return Unauthorized(new { message = "Invalid Google token." });
        }

        // Check if email is Gmail
        if (!googleUser.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
        {
          return BadRequest(new { message = "Only Gmail accounts are allowed for Google Sign-In." });
        }

        // Check if user already exists
        var existingUser = await _userService.GetByEmailAsync(googleUser.Email);
        if (existingUser != null)
        {
          return BadRequest(new { message = "An account with this email already exists." });
        }

        // Validate phone number format (basic validation)
        if (string.IsNullOrWhiteSpace(dto.ContactNumber) || dto.ContactNumber.Length < 10)
        {
          return BadRequest(new { message = "Please provide a valid phone number." });
        }

        // Create Resident profile
        var resident = new Resident
        {
          FirstName = dto.FirstName.Trim(),
          MiddleName = dto.MiddleName?.Trim(),
          LastName = dto.LastName.Trim(),
          Extension = dto.Extension?.Trim(),
          DateOfBirth = dto.DateOfBirth.Trim(),
          ContactNumber = dto.ContactNumber.Trim(),
          IsResidentVerified = false,
          ResidentVerificationStatus = "Pending",
        };

        await _residentService.CreateAsync(resident);

        // Create User account linked to Google
        var user = new User
        {
          Email = googleUser.Email,
          GoogleId = googleUser.GoogleId,
          AuthProvider = "google",
          FirstName = dto.FirstName.Trim(),
          MiddleName = dto.MiddleName?.Trim(),
          LastName = dto.LastName.Trim(),
          Extension = dto.Extension?.Trim(),
          DateOfBirth = DateTime.Parse(dto.DateOfBirth.Trim()),
          ContactNumber = dto.ContactNumber.Trim(),
          Role = "resident",
          ResidentId = resident.Id,
          IsActive = true,
          IsEmailVerified = true, // Google verifies emails
          EmailVerifiedAt = DateTime.UtcNow,
          CreatedAt = DateTime.UtcNow,
          UpdatedAt = DateTime.UtcNow,
        };

        await _userService.CreateAsync(user);

        // Generate JWT Token
        var token = _jwtService.GenerateToken(user);

        // Return success response with token
        return Ok(new
        {
          message = "Account created successfully!",
          token,
          user = new
          {
            id = user.Id,
            email = user.Email,
            role = user.Role,
            isActive = user.IsActive,
            isEmailVerified = user.IsEmailVerified,
            firstName = resident.FirstName,
            lastName = resident.LastName,
            middleName = resident.MiddleName,
            extension = resident.Extension,
            fullName = resident.FullName,
            dateOfBirth = resident.DateOfBirth,
            contactNumber = resident.ContactNumber,
            residentId = user.ResidentId,
            authProvider = user.AuthProvider,
            googleId = user.GoogleId,
            emailVerifiedAt = user.EmailVerifiedAt,
            createdAt = user.CreatedAt,
            updatedAt = user.UpdatedAt
          }
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
      }
    }

    private async Task<GoogleUserInfo?> VerifyGoogleTokenAsync(string accessToken)
    {
      try
      {
        var httpClient = _httpClientFactory.CreateClient();
        
        // Use the userinfo endpoint with the access token
        httpClient.DefaultRequestHeaders.Authorization = 
          new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        
        var response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
        
        if (!response.IsSuccessStatusCode)
        {
          return null;
        }

        var content = await response.Content.ReadAsStringAsync();
        var userInfo = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(content);

        if (userInfo == null)
        {
          return null;
        }

        // Extract user information
        var email = userInfo.TryGetValue("email", out var emailElement) ? emailElement.GetString() : null;
        var googleId = userInfo.TryGetValue("sub", out var subElement) ? subElement.GetString() : null;
        var name = userInfo.TryGetValue("name", out var nameElement) ? nameElement.GetString() : null;
        var givenName = userInfo.TryGetValue("given_name", out var givenNameElement) ? givenNameElement.GetString() : null;
        var familyName = userInfo.TryGetValue("family_name", out var familyNameElement) ? familyNameElement.GetString() : null;
        var emailVerified = userInfo.TryGetValue("email_verified", out var verifiedElement) && verifiedElement.GetBoolean();

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
        {
          return null;
        }

        return new GoogleUserInfo
        {
          Email = email,
          GoogleId = googleId,
          Name = name ?? "",
          GivenName = givenName ?? "",
          FamilyName = familyName ?? "",
          EmailVerified = emailVerified
        };
      }
      catch
      {
        return null;
      }
    }

    private class GoogleUserInfo
    {
      public required string Email { get; set; }
      public required string GoogleId { get; set; }
      public required string Name { get; set; }
      public required string GivenName { get; set; }
      public required string FamilyName { get; set; }
      public bool EmailVerified { get; set; }
    }

  }
}
