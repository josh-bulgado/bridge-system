using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class BarangayConfigService
    {
        private readonly IMongoCollection<BarangayConfig> _barangayConfigCollection;

        public BarangayConfigService(MongoDBContext context)
        {
            _barangayConfigCollection = context.GetCollection<BarangayConfig>("barangay-config");
        }

        // Get the current barangay configuration (there should only be one)
        public async Task<BarangayConfig?> GetConfigAsync()
        {
            var configs = await _barangayConfigCollection.Find(_ => true).ToListAsync();
            return configs.FirstOrDefault();
        }

        // Create new barangay configuration
        public async Task<BarangayConfig> CreateConfigAsync(BarangayConfig config)
        {
            config.CreatedAt = DateTime.UtcNow;
            config.UpdatedAt = DateTime.UtcNow;

            await _barangayConfigCollection.InsertOneAsync(config);
            return config;
        }

        // Update existing barangay configuration
        public async Task<BarangayConfig> UpdateConfigAsync(string id, BarangayConfig config)
        {
            config.UpdatedAt = DateTime.UtcNow;

            var filter = Builders<BarangayConfig>.Filter.Eq(c => c.Id, id);
            await _barangayConfigCollection.ReplaceOneAsync(filter, config);

            return config;
        }

        // Create or update barangay configuration (upsert operation)
        public async Task<BarangayConfig> CreateOrUpdateConfigAsync(BarangayConfig config, string? userId = null)
        {
            var existingConfig = await GetConfigAsync();

            if (existingConfig != null)
            {
                // Update existing config
                config.Id = existingConfig.Id;
                config.CreatedAt = existingConfig.CreatedAt;
                config.CreatedBy = existingConfig.CreatedBy;
                config.UpdatedBy = userId;

                return await UpdateConfigAsync(existingConfig.Id!, config);
            }
            else
            {
                // Create new config
                config.CreatedBy = userId;
                config.UpdatedBy = userId;

                return await CreateConfigAsync(config);
            }
        }

        // Check if barangay configuration exists
        public async Task<bool> ConfigExistsAsync()
        {
            var count = await _barangayConfigCollection.CountDocumentsAsync(_ => true);
            return count > 0;
        }
    }
}