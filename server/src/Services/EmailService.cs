using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace server.Services
{
  public class EmailService
  {
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;
    private readonly bool _emailEnabled;

    public EmailService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
      // ✅ EMAIL ENABLED: Using new Resend API key account
      _emailEnabled = configuration.GetValue<bool>("EMAIL_ENABLED", true);
      
      _apiKey = configuration["RESEND_API_KEY"] ?? throw new ArgumentNullException("RESEND_API_KEY is not configured.");
      _fromEmail = configuration["RESEND_FROM_EMAIL"] ?? "onboarding@resend.dev";
      _fromName = configuration["RESEND_FROM_NAME"] ?? "Bridge System";

      _httpClient = httpClientFactory.CreateClient();
      if (_emailEnabled)
      {
        _httpClient.BaseAddress = new Uri("https://api.resend.com/");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
      }
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string otp)
    {
      if (!_emailEnabled)
      {
        Console.WriteLine($"[EMAIL DISABLED] Verification email to {toEmail} with OTP {otp} - NOT SENT");
        return true;
      }

      try
      {
        var emailData = new
        {
          from = $"{_fromName} <{_fromEmail}>",
          to = new[] { toEmail },
          subject = "Verify Your Email - Bridge System",
          html = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #262626; 
            background-color: #f5f5f5;
            padding: 32px 16px;
        }}
        .email-wrapper {{ 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }}
        .header {{ 
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white; 
            padding: 32px 24px;
            text-align: center;
        }}
        .header h1 {{ 
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 0;
            line-height: 1.2;
        }}
        .content {{ 
            background-color: #ffffff;
            padding: 48px 32px;
        }}
        .welcome-section {{ 
            text-align: center;
            margin-bottom: 48px;
        }}
        .welcome-section h2 {{ 
            font-size: 24px;
            font-weight: 700;
            color: #171717;
            margin-bottom: 16px;
            line-height: 1.3;
        }}
        .welcome-section p {{ 
            font-size: 16px;
            color: #525252;
            line-height: 1.6;
            margin: 0;
        }}
        .otp-section {{ 
            margin: 48px 0;
        }}
        .otp-code {{ 
            font-size: 40px;
            font-weight: 700;
            color: #22c55e;
            text-align: center;
            letter-spacing: 12px;
            padding: 24px;
            background: linear-gradient(to bottom, #f9fafb, #ffffff);
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            margin: 0 auto;
            font-family: 'Courier New', monospace;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }}
        .warning-section {{ 
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px 24px;
            border-radius: 8px;
            margin: 32px 0;
        }}
        .warning-section p {{ 
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: #78350f;
        }}
        .warning-section p:first-child {{ 
            font-weight: 600;
            margin-bottom: 8px;
        }}
        .warning-section p strong {{ 
            font-weight: 700;
        }}
        .signature {{ 
            margin-top: 48px;
            padding-top: 32px;
            border-top: 1px solid #e5e7eb;
            text-align: left;
        }}
        .signature p {{ 
            font-size: 15px;
            color: #404040;
            line-height: 1.8;
            margin: 0;
        }}
        .signature .team-name {{ 
            font-weight: 600;
            color: #171717;
        }}
        .footer {{ 
            background-color: #fafafa;
            text-align: center;
            padding: 24px 32px;
            border-top: 1px solid #e5e7eb;
        }}
        .footer p {{ 
            font-size: 13px;
            color: #737373;
            margin: 0;
            line-height: 1.5;
        }}
        @media only screen and (max-width: 600px) {{
            body {{ padding: 16px 8px; }}
            .content {{ padding: 32px 24px; }}
            .otp-code {{ 
                font-size: 32px; 
                letter-spacing: 8px;
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class='email-wrapper'>
        <div class='header'>
            <h1>bridge</h1>
        </div>
        <div class='content'>
            <div class='welcome-section'>
                <h2>Welcome to Bridge System!</h2>
                <p>Thank you for registering. Please verify your email address using the code below:</p>
            </div>
            
            <div class='otp-section'>
                <div class='otp-code'>{otp}</div>
            </div>
            
            <div class='warning-section'>
                <p><strong>⚠️ This code will expire in 10 minutes.</strong></p>
                <p>Please don't share this code with anyone for your account security.</p>
            </div>
            
            <div class='signature'>
                <p>Thanks,<br/><span class='team-name'>The Bridge Team</span></p>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Bridge System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"
        };

        var jsonContent = JsonSerializer.Serialize(emailData);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("emails", content);

        if (!response.IsSuccessStatusCode)
        {
          var errorContent = await response.Content.ReadAsStringAsync();
          // Removed: Error content may contain sensitive info
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception)
      {
        // Removed: Stack trace may contain sensitive info
        return false;
      }
    }

    public string GenerateOtp()
    {
      var random = new Random();
      return random.Next(100000, 999999).ToString();
    }

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string otp)
    {
      if (!_emailEnabled)
      {
        Console.WriteLine($"[EMAIL DISABLED] Password reset email to {toEmail} with OTP {otp} - NOT SENT");
        return true;
      }

      try
      {
        var emailData = new
        {
          from = $"{_fromName} <{_fromEmail}>",
          to = new[] { toEmail },
          subject = "Reset Your Password - Bridge System",
          html = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #262626; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background-color: #fafafa; padding: 30px; border-radius: 0 0 8px 8px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #22c55e; text-align: center; letter-spacing: 8px; padding: 20px; background-color: white; border-radius: 8px; margin: 20px 0; }}
        .warning {{ background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #737373; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>bridge</h1>
        </div>
        <div class='content'>
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Use the code below to reset your password:</p>
            <div class='otp-code'>{otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <div class='warning'>
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Bridge System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"
        };

        var jsonContent = JsonSerializer.Serialize(emailData);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("emails", content);

        if (!response.IsSuccessStatusCode)
        {
          var errorContent = await response.Content.ReadAsStringAsync();
          // Removed: Error content may contain sensitive info
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception)
      {
        // Removed: Stack trace may contain sensitive info
        return false;
      }
    }

    // Generic email sending method for reminders and notifications
    public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
      if (!_emailEnabled)
      {
        Console.WriteLine($"[EMAIL DISABLED] Email to {toEmail} with subject '{subject}' - NOT SENT");
        return true;
      }

      try
      {
        var emailData = new
        {
          from = $"{_fromName} <{_fromEmail}>",
          to = new[] { toEmail },
          subject = subject,
          html = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #262626; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background-color: #fafafa; padding: 30px; border-radius: 0 0 8px 8px; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #737373; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Bridge System</h1>
        </div>
        <div class='content'>
            {htmlBody}
        </div>
        <div class='footer'>
            <p>&copy; 2025 Bridge System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>"
        };

        var jsonContent = JsonSerializer.Serialize(emailData);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("emails", content);

        if (!response.IsSuccessStatusCode)
        {
          var errorContent = await response.Content.ReadAsStringAsync();
          // Removed: Error content may contain sensitive info
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception)
      {
        // Removed: Stack trace may contain sensitive info
        return false;
      }
    }
  }
}
