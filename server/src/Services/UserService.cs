using MongoDB.Driver;
using server.Models;

namespace server.Services
{
  public class UserService
  {
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<PasswordHistory> _passwordHistory;

    public UserService(MongoDBContext context)
    {
      _users = context.GetCollection<User>("users");
      _passwordHistory = context.GetCollection<PasswordHistory>("passwordHistory");
    }

    public async Task<List<User>> GetAsync() =>
        await _users.Find(_ => true).ToListAsync();

    public async Task CreateAsync(User user) =>
        await _users.InsertOneAsync(user);

    public async Task<User> GetByIdAsync(string id) =>
        await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task<User?> GetByEmailAsync(string email)
    {
      return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(string id, User user)
    {
      user.UpdatedAt = DateTime.UtcNow;
      await _users.ReplaceOneAsync(x => x.Id == id, user);
    }

    public async Task<bool> VerifyOtpAsync(string email, string otp)
    {
      var user = await GetByEmailAsync(email);
      if (user == null) return false;

      if (user.EmailVerificationOtp == otp && user.OtpExpiresAt > DateTime.UtcNow)
      {
        user.IsEmailVerified = true;
        user.EmailVerifiedAt = DateTime.UtcNow;
        user.EmailVerificationOtp = null;
        user.OtpExpiresAt = null;
        await UpdateAsync(user.Id!, user);
        return true;
      }

      return false;
    }

    public async Task<List<User>> GetUnverifiedUsersOlderThan(DateTime cutoffDate)
    {
      var filter = Builders<User>.Filter.And(
        Builders<User>.Filter.Eq(u => u.IsEmailVerified, false),
        Builders<User>.Filter.Lt(u => u.CreatedAt, cutoffDate)
      );
      return await _users.Find(filter).ToListAsync();
    }

    public async Task<List<User>> GetUnverifiedUsersBetween(DateTime startDate, DateTime endDate)
    {
      var filter = Builders<User>.Filter.And(
        Builders<User>.Filter.Eq(u => u.IsEmailVerified, false),
        Builders<User>.Filter.Gte(u => u.CreatedAt, startDate),
        Builders<User>.Filter.Lt(u => u.CreatedAt, endDate)
      );
      return await _users.Find(filter).ToListAsync();
    }

    public async Task<bool> DeleteUserByEmail(string email)
    {
      var result = await _users.DeleteOneAsync(u => u.Email == email);
      return result.DeletedCount > 0;
    }

    public async Task<bool> IsPasswordInHistoryAsync(string userId, string newPassword)
    {
        // Get last 5 passwords
        var history = await _passwordHistory
            .Find(ph => ph.UserId == userId)
            .SortByDescending(ph => ph.CreatedAt)
            .Limit(5)
            .ToListAsync();

        foreach (var record in history)
        {
            if (!string.IsNullOrWhiteSpace(record.PasswordHash) && 
                record.PasswordHash.StartsWith("$") && 
                BCrypt.Net.BCrypt.Verify(newPassword, record.PasswordHash))
            {
                return true;
            }
        }
        return false;
    }

    public async Task AddToPasswordHistoryAsync(string userId, string passwordHash)
    {
        var history = new PasswordHistory
        {
            UserId = userId,
            PasswordHash = passwordHash
        };
        await _passwordHistory.InsertOneAsync(history);
    }

    public async Task<(bool Success, string Message)> ResetPasswordAsync(string email, string otp, string newPassword, string newPasswordHash)
    {
      var user = await GetByEmailAsync(email);
      if (user == null) return (false, "User not found.");

      // Verify OTP and expiry
      if (user.EmailVerificationOtp != otp || user.OtpExpiresAt <= DateTime.UtcNow)
      {
          return (false, "Invalid or expired reset code.");
      }

      // Check if new password is same as current password
      if (!string.IsNullOrWhiteSpace(user.PasswordHash) && 
          user.PasswordHash.StartsWith("$") && 
          BCrypt.Net.BCrypt.Verify(newPassword, user.PasswordHash))
      {
          return (false, "Cannot use your old password.");
      }

      // Check password history
      if (await IsPasswordInHistoryAsync(user.Id!, newPassword))
      {
          return (false, "Cannot use a previously used password.");
      }

      // Add current password to history before updating (only if it exists and is valid)
      if (!string.IsNullOrWhiteSpace(user.PasswordHash) && user.PasswordHash.StartsWith("$"))
      {
          await AddToPasswordHistoryAsync(user.Id!, user.PasswordHash);
      }

      user.PasswordHash = newPasswordHash;
      user.EmailVerificationOtp = null;
      user.OtpExpiresAt = null;
      await UpdateAsync(user.Id!, user);
      return (true, "Password reset successfully.");
    }
  }


}
