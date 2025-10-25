using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(MongoDBContext context)
        {
            // "users" = the name of your collection in MongoDB
            _users = context.GetCollection<User>("users");
        }

        public async Task<List<User>> GetAsync() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);

        public async Task<User> GetByIdAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();
    }
}
