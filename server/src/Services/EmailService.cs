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

    public EmailService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
      _apiKey = configuration["RESEND_API_KEY"] ?? throw new ArgumentNullException("RESEND_API_KEY is not configured.");
      _fromEmail = configuration["RESEND_FROM_EMAIL"] ?? "onboarding@resend.dev";
      _fromName = configuration["RESEND_FROM_NAME"] ?? "Bridge System";

      _httpClient = httpClientFactory.CreateClient();
      _httpClient.BaseAddress = new Uri("https://api.resend.com/");
      _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string otp)
    {
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
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #262626; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background-color: #fafafa; padding: 30px; border-radius: 0 0 8px 8px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #22c55e; text-align: center; letter-spacing: 8px; padding: 20px; background-color: white; border-radius: 8px; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #737373; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>bridge</h1>
        </div>
        <div class='content'>
            <h2>Welcome to Bridge System!</h2>
            <p>Thank you for registering. Please verify your email address using the code below:</p>
            <div class='otp-code'>{otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't create an account with Bridge System, please ignore this email.</p>
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
          Console.WriteLine($"Email sending failed. Status: {response.StatusCode}, Error: {errorContent}");
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending email: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
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
          Console.WriteLine($"Email sending failed. Status: {response.StatusCode}, Error: {errorContent}");
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending email: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return false;
      }
    }

    // Generic email sending method for reminders and notifications
    public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
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
          Console.WriteLine($"Email sending failed. Status: {response.StatusCode}, Error: {errorContent}");
        }

        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending email: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return false;
      }
    }
  }
}
