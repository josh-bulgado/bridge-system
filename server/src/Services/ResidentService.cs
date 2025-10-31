using MongoDB.Driver;
using server.Models;
using BCrypt.Net;

namespace server.Services
{
    public class ResidentService
    {
        private readonly IMongoCollection<Resident> _residents;

        public ResidentService(MongoDBContext context)
        {
            _residents = context.GetCollection<Resident>("residents");
        }

        // Get all residents
        public async Task<List<Resident>> GetAsync() =>
            await _residents.Find(_ => true).ToListAsync();

        // Get resident by ID
        public async Task<Resident?> GetByIdAsync(string id) =>
            await _residents.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Create new resident
        public async Task<Resident> CreateAsync(Resident resident)
        {
            resident.LastUpdated = DateTime.UtcNow;

            await _residents.InsertOneAsync(resident);
            return resident;
        }

        // Update resident
        public async Task UpdateAsync(string id, Resident resident)
        {
            resident.LastUpdated = DateTime.UtcNow;
            await _residents.ReplaceOneAsync(x => x.Id == id, resident);
        }


        // Delete resident
        public async Task RemoveAsync(string id) =>
            await _residents.DeleteOneAsync(x => x.Id == id);


        // Search residents by name
        public async Task<List<Resident>> SearchByNameAsync(string searchTerm)
        {
            var filter = Builders<Resident>.Filter.Or(
                Builders<Resident>.Filter.Regex(x => x.FirstName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
                Builders<Resident>.Filter.Regex(x => x.LastName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );
            return await _residents.Find(filter).ToListAsync();
        }
    }
}