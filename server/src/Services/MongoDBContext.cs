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
            // Try to get from environment variable first, fallback to appsettings value
            var connectionUri = Env.GetString(mongoSettings.Value.ConnectionURI);
            
            // If environment variable is not set, use the value from appsettings.json directly
            if (string.IsNullOrEmpty(connectionUri))
            {
                connectionUri = mongoSettings.Value.ConnectionURI;
            }

            if (string.IsNullOrEmpty(connectionUri))
            {
                throw new Exception($"MongoDB connection string is missing. Please configure ConnectionURI in appsettings.json or set the environment variable.");
            }

            Console.WriteLine($"[MONGODB] 🔌 Connecting to MongoDB...");
            Console.WriteLine($"[MONGODB] 📍 Database: {mongoSettings.Value.DatabaseName}");
            
            try
            {
                var clientSettings = MongoClientSettings.FromConnectionString(connectionUri);
                clientSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
                clientSettings.ConnectTimeout = TimeSpan.FromSeconds(10);
                clientSettings.SocketTimeout = TimeSpan.FromSeconds(10);
                
                var client = new MongoClient(clientSettings);
                _database = client.GetDatabase(mongoSettings.Value.DatabaseName);
                
                // Test the connection immediately
                var pingTask = _database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}");
                pingTask.Wait(TimeSpan.FromSeconds(5));
                
                Console.WriteLine($"[MONGODB] ✅ Connected successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[MONGODB] ❌ Connection FAILED!");
                Console.WriteLine($"[MONGODB] ❌ Error: {ex.Message}");
                Console.WriteLine($"[MONGODB] ❌ Type: {ex.GetType().Name}");
                throw new Exception($"Failed to connect to MongoDB: {ex.Message}", ex);
            }
        }

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        public IMongoDatabase Database => _database;
    }
}
