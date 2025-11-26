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

        // Delete resident (alias for compatibility)
        public async Task DeleteAsync(string id) =>
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

        // Submit verification request
        public async Task<Resident?> SubmitVerificationAsync(string residentId, string streetPurok, string houseNumberUnit, 
            string governmentIdType, string governmentIdFront, string governmentIdBack, 
            string proofOfResidencyType, string proofOfResidency,
            string? governmentIdFrontUrl = null, string? governmentIdBackUrl = null, string? proofOfResidencyUrl = null,
            string? governmentIdFrontFileType = null, string? governmentIdBackFileType = null, string? proofOfResidencyFileType = null)
        {
            var resident = await GetByIdAsync(residentId);
            if (resident == null)
                return null;

            // Initialize verification history list if null
            if (resident.VerificationHistory == null)
            {
                resident.VerificationHistory = new List<VerificationHistoryEntry>();
            }

            // If there's an existing verification submission, only archive it to history if it hasn't been archived yet
            // (i.e., only archive if the status is NOT "Rejected" since rejection already archives it)
            if (resident.VerificationDocuments != null && 
                resident.VerificationDocuments.SubmittedAt != null && 
                resident.ResidentVerificationStatus != "Rejected")
            {
                var historyEntry = new VerificationHistoryEntry
                {
                    GovernmentIdType = resident.VerificationDocuments.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments.GovernmentIdFront,
                    GovernmentIdFrontUrl = resident.VerificationDocuments.GovernmentIdFrontUrl,
                    GovernmentIdFrontFileType = resident.VerificationDocuments.GovernmentIdFrontFileType,
                    GovernmentIdBack = resident.VerificationDocuments.GovernmentIdBack,
                    GovernmentIdBackUrl = resident.VerificationDocuments.GovernmentIdBackUrl,
                    GovernmentIdBackFileType = resident.VerificationDocuments.GovernmentIdBackFileType,
                    ProofOfResidencyType = resident.VerificationDocuments.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments.ProofOfResidency,
                    ProofOfResidencyUrl = resident.VerificationDocuments.ProofOfResidencyUrl,
                    ProofOfResidencyFileType = resident.VerificationDocuments.ProofOfResidencyFileType,
                    StreetPurok = resident.Address?.StreetPurok,
                    HouseNumberUnit = resident.Address?.HouseNumberUnit,
                    SubmittedAt = resident.VerificationDocuments.SubmittedAt.Value,
                    Status = resident.ResidentVerificationStatus,
                    ReviewedBy = resident.VerifiedBy,
                    ReviewedAt = resident.VerifiedAt,
                    RejectionReason = resident.RejectionReason // Include rejection reason in history
                };

                // Add to history
                resident.VerificationHistory.Add(historyEntry);
            }

            // Initialize address if null
            if (resident.Address == null)
            {
                resident.Address = new Address();
            }

            // Update address information
            resident.Address.StreetPurok = streetPurok;
            resident.Address.HouseNumberUnit = houseNumberUnit;

            // Update verification documents with new submission
            resident.VerificationDocuments = new VerificationDocuments
            {
                GovernmentIdType = governmentIdType,
                GovernmentIdFront = governmentIdFront,
                GovernmentIdFrontUrl = governmentIdFrontUrl,
                GovernmentIdFrontFileType = governmentIdFrontFileType,
                GovernmentIdBack = governmentIdBack,
                GovernmentIdBackUrl = governmentIdBackUrl,
                GovernmentIdBackFileType = governmentIdBackFileType,
                ProofOfResidencyType = proofOfResidencyType,
                ProofOfResidency = proofOfResidency,
                ProofOfResidencyUrl = proofOfResidencyUrl,
                ProofOfResidencyFileType = proofOfResidencyFileType,
                SubmittedAt = DateTime.UtcNow
            };

            // Update verification status to Pending for new submission
            resident.ResidentVerificationStatus = "Pending";
            // Clear rejection reason when resubmitting
            resident.RejectionReason = null;
            resident.LastUpdated = DateTime.UtcNow;

            await UpdateAsync(residentId, resident);
            return resident;
        }

        // Get resident by user ID
        public async Task<Resident?> GetByUserIdAsync(string userId) =>
            await _residents.Find(x => x.Id == userId).FirstOrDefaultAsync();

        // Approve resident verification
        public async Task<Resident?> ApproveResidentAsync(string residentId, string approvedBy)
        {
            var resident = await GetByIdAsync(residentId);
            if (resident == null)
                return null;

            resident.IsResidentVerified = true;
            resident.ResidentVerificationStatus = "Approved";
            resident.VerifiedBy = approvedBy;
            resident.VerifiedAt = DateTime.UtcNow;
            resident.LastUpdated = DateTime.UtcNow;

            await UpdateAsync(residentId, resident);
            return resident;
        }

        // Reject resident verification
        public async Task<Resident?> RejectResidentAsync(string residentId, string rejectedBy, string? rejectionReason = null)
        {
            var resident = await GetByIdAsync(residentId);
            if (resident == null)
                return null;

            // Initialize verification history list if null
            if (resident.VerificationHistory == null)
            {
                resident.VerificationHistory = new List<VerificationHistoryEntry>();
            }

            // Archive the current submission to history when rejecting
            if (resident.VerificationDocuments != null && resident.VerificationDocuments.SubmittedAt != null)
            {
                var historyEntry = new VerificationHistoryEntry
                {
                    GovernmentIdType = resident.VerificationDocuments.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments.GovernmentIdFront,
                    GovernmentIdFrontUrl = resident.VerificationDocuments.GovernmentIdFrontUrl,
                    GovernmentIdFrontFileType = resident.VerificationDocuments.GovernmentIdFrontFileType,
                    GovernmentIdBack = resident.VerificationDocuments.GovernmentIdBack,
                    GovernmentIdBackUrl = resident.VerificationDocuments.GovernmentIdBackUrl,
                    GovernmentIdBackFileType = resident.VerificationDocuments.GovernmentIdBackFileType,
                    ProofOfResidencyType = resident.VerificationDocuments.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments.ProofOfResidency,
                    ProofOfResidencyUrl = resident.VerificationDocuments.ProofOfResidencyUrl,
                    ProofOfResidencyFileType = resident.VerificationDocuments.ProofOfResidencyFileType,
                    StreetPurok = resident.Address?.StreetPurok,
                    HouseNumberUnit = resident.Address?.HouseNumberUnit,
                    SubmittedAt = resident.VerificationDocuments.SubmittedAt.Value,
                    Status = "Rejected", // Mark this entry as rejected
                    ReviewedBy = rejectedBy,
                    ReviewedAt = DateTime.UtcNow,
                    RejectionReason = rejectionReason // Store rejection reason in history
                };

                // Add to history
                resident.VerificationHistory.Add(historyEntry);
            }

            resident.IsResidentVerified = false;
            resident.ResidentVerificationStatus = "Rejected";
            resident.VerifiedBy = rejectedBy;
            resident.VerifiedAt = DateTime.UtcNow;
            resident.RejectionReason = rejectionReason;
            resident.LastUpdated = DateTime.UtcNow;

            await UpdateAsync(residentId, resident);
            return resident;
        }

        // Get residents by verification status
        public async Task<List<Resident>> GetByStatusAsync(string status)
        {
            var filter = Builders<Resident>.Filter.Eq(x => x.ResidentVerificationStatus, status);
            return await _residents.Find(filter).ToListAsync();
        }

        // Get verified residents only
        public async Task<List<Resident>> GetVerifiedResidentsAsync()
        {
            var filter = Builders<Resident>.Filter.Eq(x => x.IsResidentVerified, true);
            return await _residents.Find(filter).ToListAsync();
        }

        // Get pending residents
        public async Task<List<Resident>> GetPendingResidentsAsync()
        {
            var filter = Builders<Resident>.Filter.Eq(x => x.ResidentVerificationStatus, "Pending");
            return await _residents.Find(filter).ToListAsync();
        }
    }
}