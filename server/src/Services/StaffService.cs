using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class StaffService
    {
        private readonly IMongoCollection<User> _users;

        public StaffService(MongoDBContext context)
        {
            _users = context.GetCollection<User>("users");
        }

        // Get all staff members (admin and staff roles)
        public async Task<List<User>> GetAllStaffAsync()
        {
            var filter = Builders<User>.Filter.In(x => x.Role, new[] { "admin", "staff" });
            return await _users.Find(filter).ToListAsync();
        }

        // Get staff by ID
        public async Task<User?> GetStaffByIdAsync(string id)
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(x => x.Id, id),
                Builders<User>.Filter.In(x => x.Role, new[] { "admin", "staff" })
            );
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        // Get staff by email
        public async Task<User?> GetStaffByEmailAsync(string email)
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(x => x.Email, email),
                Builders<User>.Filter.In(x => x.Role, new[] { "admin", "staff" })
            );
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        // Create new staff member
        public async Task<User> CreateStaffAsync(User staff)
        {
            staff.CreatedAt = DateTime.UtcNow;
            staff.UpdatedAt = DateTime.UtcNow;
            await _users.InsertOneAsync(staff);
            return staff;
        }

        // Update staff member
        public async Task<User?> UpdateStaffAsync(string id, User staff)
        {
            var existingStaff = await GetStaffByIdAsync(id);
            if (existingStaff == null)
                return null;

            staff.Id = id;
            staff.CreatedAt = existingStaff.CreatedAt;
            staff.UpdatedAt = DateTime.UtcNow;

            var result = await _users.ReplaceOneAsync(x => x.Id == id, staff);
            return result.ModifiedCount > 0 ? staff : null;
        }

        // Delete staff member
        public async Task<bool> DeleteStaffAsync(string id)
        {
            var staff = await GetStaffByIdAsync(id);
            if (staff == null)
                return false;

            var result = await _users.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }

        // Toggle staff status (Active/Inactive)
        public async Task<User?> ToggleStaffStatusAsync(string id, bool isActive)
        {
            var staff = await GetStaffByIdAsync(id);
            if (staff == null)
                return null;

            var update = Builders<User>.Update
                .Set(x => x.IsActive, isActive)
                .Set(x => x.UpdatedAt, DateTime.UtcNow);

            await _users.UpdateOneAsync(x => x.Id == id, update);
            
            return await GetStaffByIdAsync(id);
        }

        // Update staff role
        public async Task<User?> UpdateStaffRoleAsync(string id, string role)
        {
            var staff = await GetStaffByIdAsync(id);
            if (staff == null)
                return null;

            var update = Builders<User>.Update
                .Set(x => x.Role, role)
                .Set(x => x.UpdatedAt, DateTime.UtcNow);

            await _users.UpdateOneAsync(x => x.Id == id, update);
            
            return await GetStaffByIdAsync(id);
        }

        // Search staff by email
        public async Task<List<User>> SearchStaffByEmailAsync(string searchTerm)
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.In(x => x.Role, new[] { "admin", "staff" }),
                Builders<User>.Filter.Regex(
                    x => x.Email, 
                    new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")
                )
            );
            return await _users.Find(filter).ToListAsync();
        }

        // Get staff by role
        public async Task<List<User>> GetStaffByRoleAsync(string role)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Role, role);
            return await _users.Find(filter).ToListAsync();
        }

        // Get active staff only
        public async Task<List<User>> GetActiveStaffAsync()
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.In(x => x.Role, new[] { "admin", "staff" }),
                Builders<User>.Filter.Eq(x => x.IsActive, true)
            );
            return await _users.Find(filter).ToListAsync();
        }

        // Check if email already exists
        public async Task<bool> EmailExistsAsync(string email)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Email, email);
            var count = await _users.CountDocumentsAsync(filter);
            return count > 0;
        }
    }
}
