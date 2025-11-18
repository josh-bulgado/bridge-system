using MongoDB.Driver;
using server.Models;

namespace server.Services
{
  public class UserService
  {
    private readonly IMongoCollection<User> _users;

    public UserService(MongoDBContext context)
    {
      _users = context.GetCollection<User>("users");
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
  }


}
