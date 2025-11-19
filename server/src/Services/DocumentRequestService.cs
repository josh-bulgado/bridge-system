using MongoDB.Driver;
using server.Models;

namespace server.Services
{
    public class DocumentRequestService
    {
        private readonly IMongoCollection<DocumentRequest> _documentRequests;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Resident> _residents;

        public DocumentRequestService(MongoDBContext context)
        {
            _documentRequests = context.GetCollection<DocumentRequest>("documentRequests");
            _users = context.GetCollection<User>("users");
            _residents = context.GetCollection<Resident>("residents");
        }

        // Generate unique request number
        private async Task<string> GenerateRequestNumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var lastRequest = await _documentRequests
                .Find(r => r.RequestNumber.StartsWith($"REQ-{year}-"))
                .SortByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            int nextNumber = 1;
            if (lastRequest != null && !string.IsNullOrEmpty(lastRequest.RequestNumber))
            {
                var parts = lastRequest.RequestNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int lastNum))
                {
                    nextNumber = lastNum + 1;
                }
            }

            return $"REQ-{year}-{nextNumber:D3}";
        }

        // Create new document request
        public async Task<DocumentRequest> CreateAsync(DocumentRequest request)
        {
            request.RequestNumber = await GenerateRequestNumberAsync();
            request.CreatedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;
            
            // Initialize status history
            request.StatusHistory = new List<StatusHistory>
            {
                new StatusHistory
                {
                    Status = request.Status,
                    ChangedAt = DateTime.UtcNow,
                    Comment = "Request created"
                }
            };

            await _documentRequests.InsertOneAsync(request);
            return request;
        }

        // Get all document requests
        public async Task<List<DocumentRequest>> GetAllAsync() =>
            await _documentRequests.Find(_ => true)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        // Get document request by ID
        public async Task<DocumentRequest?> GetByIdAsync(string id) =>
            await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();

        // Get requests by user ID
        public async Task<List<DocumentRequest>> GetByUserIdAsync(string userId) =>
            await _documentRequests.Find(r => r.UserId == userId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        // Get requests by resident ID
        public async Task<List<DocumentRequest>> GetByResidentIdAsync(string residentId) =>
            await _documentRequests.Find(r => r.ResidentId == residentId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        // Get requests by status
        public async Task<List<DocumentRequest>> GetByStatusAsync(string status) =>
            await _documentRequests.Find(r => r.Status == status)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        // Get requests assigned to staff member
        public async Task<List<DocumentRequest>> GetAssignedToAsync(string staffId) =>
            await _documentRequests.Find(r => r.AssignedTo == staffId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        // Update request status
        public async Task<DocumentRequest?> UpdateStatusAsync(
            string id, 
            string newStatus, 
            string? changedBy = null, 
            string? comment = null)
        {
            var request = await GetByIdAsync(id);
            if (request == null) return null;

            request.Status = newStatus;
            request.UpdatedAt = DateTime.UtcNow;

            // Add to status history
            request.StatusHistory.Add(new StatusHistory
            {
                Status = newStatus,
                ChangedBy = changedBy,
                ChangedAt = DateTime.UtcNow,
                Comment = comment
            });

            // Update specific fields based on status
            if (newStatus == "Processing" && request.ProcessedBy == null)
            {
                request.ProcessedBy = changedBy;
                request.ProcessedAt = DateTime.UtcNow;
            }
            else if (newStatus == "Completed" && request.PickedUpAt == null)
            {
                request.PickedUpAt = DateTime.UtcNow;
            }

            await _documentRequests.ReplaceOneAsync(r => r.Id == id, request);
            return request;
        }

        // Update entire request
        public async Task<DocumentRequest?> UpdateAsync(string id, DocumentRequest request)
        {
            request.UpdatedAt = DateTime.UtcNow;
            await _documentRequests.ReplaceOneAsync(r => r.Id == id, request);
            return request;
        }

        // Assign request to staff
        public async Task<DocumentRequest?> AssignToStaffAsync(string id, string staffId)
        {
            var request = await GetByIdAsync(id);
            if (request == null) return null;

            request.AssignedTo = staffId;
            request.UpdatedAt = DateTime.UtcNow;

            await _documentRequests.ReplaceOneAsync(r => r.Id == id, request);
            return request;
        }

        // Update payment status
        public async Task<DocumentRequest?> UpdatePaymentStatusAsync(
            string id, 
            string paymentStatus, 
            string? verifiedBy = null)
        {
            var request = await GetByIdAsync(id);
            if (request == null) return null;

            request.PaymentStatus = paymentStatus;
            request.UpdatedAt = DateTime.UtcNow;

            if (paymentStatus == "Verified" && verifiedBy != null)
            {
                request.PaymentVerifiedBy = verifiedBy;
                request.PaymentVerifiedAt = DateTime.UtcNow;
            }

            await _documentRequests.ReplaceOneAsync(r => r.Id == id, request);
            return request;
        }

        // Schedule pickup
        public async Task<DocumentRequest?> SchedulePickupAsync(string id, DateTime pickupDate)
        {
            var request = await GetByIdAsync(id);
            if (request == null) return null;

            request.PickupSchedule = pickupDate;
            request.UpdatedAt = DateTime.UtcNow;

            await _documentRequests.ReplaceOneAsync(r => r.Id == id, request);
            return request;
        }

        // Delete request
        public async Task DeleteAsync(string id) =>
            await _documentRequests.DeleteOneAsync(r => r.Id == id);

        // Get request statistics for a user
        public async Task<RequestStatistics> GetUserStatisticsAsync(string userId)
        {
            var requests = await GetByUserIdAsync(userId);

            return new RequestStatistics
            {
                TotalRequests = requests.Count,
                PendingRequests = requests.Count(r => r.Status == "Pending"),
                ProcessingRequests = requests.Count(r => r.Status == "Processing"),
                ActionRequiredRequests = requests.Count(r => r.Status == "Action Required"),
                ReadyForPickupRequests = requests.Count(r => r.Status == "Ready for Pickup"),
                CompletedRequests = requests.Count(r => r.Status == "Completed"),
                RejectedRequests = requests.Count(r => r.Status == "Rejected")
            };
        }

        // Get all statistics (for admin/staff)
        public async Task<RequestStatistics> GetAllStatisticsAsync()
        {
            var requests = await GetAllAsync();

            return new RequestStatistics
            {
                TotalRequests = requests.Count,
                PendingRequests = requests.Count(r => r.Status == "Pending"),
                ProcessingRequests = requests.Count(r => r.Status == "Processing"),
                ActionRequiredRequests = requests.Count(r => r.Status == "Action Required"),
                ReadyForPickupRequests = requests.Count(r => r.Status == "Ready for Pickup"),
                CompletedRequests = requests.Count(r => r.Status == "Completed"),
                RejectedRequests = requests.Count(r => r.Status == "Rejected")
            };
        }
    }

    public class RequestStatistics
    {
        public int TotalRequests { get; set; }
        public int PendingRequests { get; set; }
        public int ProcessingRequests { get; set; }
        public int ActionRequiredRequests { get; set; }
        public int ReadyForPickupRequests { get; set; }
        public int CompletedRequests { get; set; }
        public int RejectedRequests { get; set; }
    }
}
