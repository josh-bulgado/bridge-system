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
      _apiKey = configuration["Resend:ApiKey"] ?? throw new ArgumentNullException("Resend:ApiKey");
      _fromEmail = configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
      _fromName = configuration["Resend:FromName"] ?? "Bridge System";

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
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
        .otp-code {{ font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; letter-spacing: 8px; padding: 20px; background-color: white; border-radius: 8px; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🌉 Bridge System</h1>
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
        return response.IsSuccessStatusCode;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error sending email: {ex.Message}");
        return false;
      }
    }

    public string GenerateOtp()
    {
      var random = new Random();
      return random.Next(100000, 999999).ToString();
    }
  }
}
