using MongoDB.Driver;
using Microsoft.Extensions.Options;
using DotNetEnv;

namespace server.Services
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(IOptions<MongoDBSettings> mongoSettings)
        {
            // Get value from environment variable (.env)
            var connectionUri = Env.GetString(mongoSettings.Value.ConnectionURI);

            if (string.IsNullOrEmpty(connectionUri))
            {
                throw new Exception($"Environment variable '{mongoSettings.Value.ConnectionURI}' is missing or empty.");
            }

            var client = new MongoClient(connectionUri);
            _database = client.GetDatabase(mongoSettings.Value.DatabaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }
    }
}
