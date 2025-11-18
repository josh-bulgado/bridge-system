using MongoDB.Driver;
using server.Models;

namespace server.Services
{
  public class AccountCleanupService : BackgroundService
  {
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AccountCleanupService> _logger;
    private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(24); // Run daily
    private readonly int _daysBeforeDeletion;

    // Get from environment variable or default to 3 days

    public AccountCleanupService(
      IServiceProvider serviceProvider,
      ILogger<AccountCleanupService> logger)
    {
      _serviceProvider = serviceProvider;
      _logger = logger;
      
      // Read from environment variable, default to 3 days
      var daysConfig = Environment.GetEnvironmentVariable("UNVERIFIED_ACCOUNT_DELETION_DAYS");
      _daysBeforeDeletion = int.TryParse(daysConfig, out var days) ? days : 3;
      
      _logger.LogInformation($"Account Cleanup Service configured to delete unverified accounts after {_daysBeforeDeletion} days");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      _logger.LogInformation("Account Cleanup Service started");

      while (!stoppingToken.IsCancellationRequested)
      {
        try
        {
          await CleanupUnverifiedAccounts();
          await SendReminderEmails();
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Error occurred during account cleanup");
        }

        await Task.Delay(_cleanupInterval, stoppingToken);
      }
    }

    private async Task CleanupUnverifiedAccounts()
    {
      using var scope = _serviceProvider.CreateScope();
      var userService = scope.ServiceProvider.GetRequiredService<UserService>();
      var residentService = scope.ServiceProvider.GetRequiredService<ResidentService>();

      var cutoffDate = DateTime.UtcNow.AddDays(-_daysBeforeDeletion);

      // Find unverified accounts older than the configured days
      var unverifiedUsers = await userService.GetUnverifiedUsersOlderThan(cutoffDate);

      foreach (var user in unverifiedUsers)
      {
        // Delete associated resident if exists
        if (!string.IsNullOrEmpty(user.ResidentId))
        {
          try
          {
            await residentService.DeleteAsync(user.ResidentId);
            _logger.LogInformation($"Deleted associated resident: {user.ResidentId}");
          }
          catch (Exception ex)
          {
            _logger.LogError(ex, $"Failed to delete resident {user.ResidentId} for user {user.Email}");
          }
        }

        // Delete user
        await userService.DeleteUserByEmail(user.Email);
        _logger.LogInformation($"Deleted unverified account: {user.Email} (Created: {user.CreatedAt})");
      }

      if (unverifiedUsers.Count > 0)
      {
        _logger.LogInformation($"Cleaned up {unverifiedUsers.Count} unverified accounts");
      }
    }

    private async Task SendReminderEmails()
    {
      using var scope = _serviceProvider.CreateScope();
      var userService = scope.ServiceProvider.GetRequiredService<UserService>();
      var emailService = scope.ServiceProvider.GetRequiredService<EmailService>();

      // Calculate reminder days based on deletion timeframe
      // For 3 days: send reminders at day 1 and day 2
      // For 7 days: send reminders at day 3 and day 6
      int firstReminderDay = _daysBeforeDeletion > 4 ? 3 : 1;
      int finalReminderDay = _daysBeforeDeletion - 1;

      // Send first reminder
      var firstReminderCutoff = DateTime.UtcNow.AddDays(-firstReminderDay);
      var firstReminderStart = firstReminderCutoff.AddHours(-1); // 1-hour window
      var firstReminderUsers = await userService.GetUnverifiedUsersBetween(firstReminderStart, firstReminderCutoff);

      foreach (var user in firstReminderUsers)
      {
        int daysRemaining = _daysBeforeDeletion - firstReminderDay;
        var subject = $"Verify Your Email - {daysRemaining} {(daysRemaining == 1 ? "Day" : "Days")} Remaining";
        var body = $@"
          <h2>Hi there!</h2>
          <p>You created an account with us {firstReminderDay} {(firstReminderDay == 1 ? "day" : "days")} ago, but haven't verified your email yet.</p>
          <p><strong>Your account will be automatically deleted in {daysRemaining} {(daysRemaining == 1 ? "day" : "days")} if not verified.</strong></p>
          <p>Please log in to verify your email and activate your account.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        ";

        await emailService.SendEmailAsync(user.Email, subject, body);
        _logger.LogInformation($"Sent day {firstReminderDay} reminder to: {user.Email}");
      }

      // Send final reminder (1 day before deletion)
      var finalReminderCutoff = DateTime.UtcNow.AddDays(-finalReminderDay);
      var finalReminderStart = finalReminderCutoff.AddHours(-1); // 1-hour window
      var finalReminderUsers = await userService.GetUnverifiedUsersBetween(finalReminderStart, finalReminderCutoff);

      foreach (var user in finalReminderUsers)
      {
        var subject = "Final Reminder: Verify Your Email - 1 Day Remaining";
        var body = $@"
          <h2>Final Reminder!</h2>
          <p>Your account will be deleted in approximately 24 hours if you don't verify your email.</p>
          <p><strong>This is your last chance to activate your account.</strong></p>
          <p>Please log in now to verify your email.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        ";

        await emailService.SendEmailAsync(user.Email, subject, body);
        _logger.LogInformation($"Sent final reminder (day {finalReminderDay}) to: {user.Email}");
      }
    }
  }
}
