using MongoDB.Driver;
using server.DTOs.Dashboard;
using server.Models;

namespace server.Services;

public class DashboardService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Resident> _residents;
    private readonly IMongoCollection<DocumentRequest> _documentRequests;
    private readonly IMongoCollection<Document> _documents;

    public DashboardService(MongoDBContext context)
    {
        _users = context.GetCollection<User>("users");
        _residents = context.GetCollection<Resident>("residents");
        _documentRequests = context.GetCollection<DocumentRequest>("documentRequests");
        _documents = context.GetCollection<Document>("documents");
    }

    public async Task<AdminDashboardStatsResponse> GetAdminDashboardStatsAsync()
    {
        var now = DateTime.UtcNow;
        var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
        var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);
        var startOfTwoMonthsAgo = startOfCurrentMonth.AddMonths(-2);

        // Get all residents
        var allResidents = await _residents.Find(_ => true).ToListAsync();
        var verifiedResidents = allResidents.Where(r => r.ResidentVerificationStatus == "Approved").ToList();
        var pendingVerifications = allResidents.Where(r => r.ResidentVerificationStatus == "Pending" || r.ResidentVerificationStatus == "Under Review").ToList();

        // Get residents by period for comparison
        var residentsCurrentMonth = allResidents.Where(r => r.LastUpdated >= startOfCurrentMonth).Count();
        var residentsPreviousMonth = allResidents.Where(r => r.LastUpdated >= startOfPreviousMonth && r.LastUpdated < startOfCurrentMonth).Count();

        // Get verified residents by period
        var verifiedCurrentMonth = verifiedResidents.Where(r => r.VerifiedAt.HasValue && r.VerifiedAt >= startOfCurrentMonth).Count();
        var verifiedPreviousMonth = verifiedResidents.Where(r => r.VerifiedAt.HasValue && r.VerifiedAt >= startOfPreviousMonth && r.VerifiedAt < startOfCurrentMonth).Count();

        // Get all staff
        var activeStaff = await _users.CountDocumentsAsync(u => 
            (u.Role == "staff" || u.Role == "admin") && u.IsActive && !u.IsDeleted);

        // Get all document requests
        var allRequests = await _documentRequests.Find(_ => true).ToListAsync();
        var completedRequests = allRequests.Where(r => r.Status == "completed").ToList();
        var pendingRequests = allRequests.Where(r => 
            r.Status == "pending" || 
            r.Status == "approved" || 
            r.Status == "payment_pending" || 
            r.Status == "payment_verified").ToList();

        // Requests by period
        var requestsCurrentMonth = allRequests.Where(r => r.CreatedAt >= startOfCurrentMonth).Count();
        var requestsPreviousMonth = allRequests.Where(r => r.CreatedAt >= startOfPreviousMonth && r.CreatedAt < startOfCurrentMonth).Count();

        // Completed documents by period
        var completedCurrentMonth = completedRequests.Where(r => r.GeneratedAt >= startOfCurrentMonth).Count();
        var completedPreviousMonth = completedRequests.Where(r => r.GeneratedAt >= startOfPreviousMonth && r.GeneratedAt < startOfCurrentMonth).Count();

        // Revenue calculation
        var revenueCurrentMonth = allRequests
            .Where(r => r.PaymentVerifiedAt >= startOfCurrentMonth)
            .Sum(r => r.Amount);
        var revenuePreviousMonth = allRequests
            .Where(r => r.PaymentVerifiedAt >= startOfPreviousMonth && r.PaymentVerifiedAt < startOfCurrentMonth)
            .Sum(r => r.Amount);

        // Recent activity (last 10 actions)
        var recentActivity = await GetRecentActivityAsync(10);

        // Popular documents
        var popularDocuments = await GetPopularDocumentsAsync();

        // Request trends (last 6 months)
        var requestTrends = await GetRequestTrendsAsync(6);

        return new AdminDashboardStatsResponse
        {
            TotalResidents = new StatWithChange
            {
                Count = allResidents.Count,
                Change = CalculatePercentageChange(residentsCurrentMonth, residentsPreviousMonth)
            },
            VerifiedResidents = new StatWithChange
            {
                Count = verifiedResidents.Count,
                Change = CalculatePercentageChange(verifiedCurrentMonth, verifiedPreviousMonth)
            },
            PendingVerifications = new StatCount
            {
                Count = pendingVerifications.Count
            },
            ActiveStaff = new StatCount
            {
                Count = (int)activeStaff
            },
            TotalDocumentsIssued = new StatWithChange
            {
                Count = completedRequests.Count,
                Change = CalculatePercentageChange(completedCurrentMonth, completedPreviousMonth)
            },
            TotalRequests = new StatWithChange
            {
                Count = allRequests.Count,
                Change = CalculatePercentageChange(requestsCurrentMonth, requestsPreviousMonth)
            },
            PendingRequests = new StatCount
            {
                Count = pendingRequests.Count
            },
            TotalRevenue = new RevenueStatWithChange
            {
                Amount = revenueCurrentMonth,
                Change = CalculatePercentageChange(revenueCurrentMonth, revenuePreviousMonth)
            },
            RecentActivity = recentActivity,
            PopularDocuments = popularDocuments,
            RequestTrends = requestTrends
        };
    }

    public async Task<StaffDashboardStatsResponse> GetStaffDashboardStatsAsync(string? userId = null)
    {
        var now = DateTime.UtcNow;
        var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
        var startOfPreviousMonth = startOfCurrentMonth.AddMonths(-1);
        var startOfToday = now.Date;

        // Get all document requests
        var allRequests = await _documentRequests.Find(_ => true).ToListAsync();

        // Requests by status
        var pendingReview = allRequests.Where(r => r.Status == "pending").ToList();
        var paymentVerification = allRequests.Where(r => r.Status == "payment_pending").ToList();
        var readyForGeneration = allRequests.Where(r => r.Status == "ready_for_generation").ToList();

        // Requests by period
        var requestsCurrentMonth = allRequests.Where(r => r.CreatedAt >= startOfCurrentMonth).Count();
        var requestsPreviousMonth = allRequests.Where(r => r.CreatedAt >= startOfPreviousMonth && r.CreatedAt < startOfCurrentMonth).Count();

        var pendingCurrentMonth = allRequests.Where(r => r.Status == "pending" && r.CreatedAt >= startOfCurrentMonth).Count();
        var pendingPreviousMonth = allRequests.Where(r => r.Status == "pending" && r.CreatedAt >= startOfPreviousMonth && r.CreatedAt < startOfCurrentMonth).Count();

        var paymentCurrentMonth = allRequests.Where(r => r.Status == "payment_pending" && r.CreatedAt >= startOfCurrentMonth).Count();
        var paymentPreviousMonth = allRequests.Where(r => r.Status == "payment_pending" && r.CreatedAt >= startOfPreviousMonth && r.CreatedAt < startOfCurrentMonth).Count();

        var generationCurrentMonth = allRequests.Where(r => r.Status == "ready_for_generation" && r.CreatedAt >= startOfCurrentMonth).Count();
        var generationPreviousMonth = allRequests.Where(r => r.Status == "ready_for_generation" && r.CreatedAt >= startOfPreviousMonth && r.CreatedAt < startOfCurrentMonth).Count();

        // Staff-specific stats (if userId provided)
        var myProcessedToday = 0;
        var completedToday = 0;
        if (!string.IsNullOrEmpty(userId))
        {
            myProcessedToday = allRequests.Count(r =>
                (r.ReviewedBy == userId || r.PaymentVerifiedBy == userId || r.GeneratedBy == userId) &&
                r.UpdatedAt.Date == startOfToday);

            completedToday = allRequests.Count(r =>
                r.GeneratedBy == userId &&
                r.Status == "completed" &&
                r.GeneratedAt.HasValue &&
                r.GeneratedAt.Value.Date == startOfToday);
        }

        // Calculate average processing time
        var completedRequests = allRequests.Where(r => 
            r.Status == "completed" && 
            r.GeneratedAt.HasValue).ToList();
        
        var avgProcessingMinutes = 0.0;
        if (completedRequests.Any())
        {
            var totalMinutes = completedRequests
                .Select(r => (r.GeneratedAt!.Value - r.CreatedAt).TotalMinutes)
                .Average();
            avgProcessingMinutes = totalMinutes;
        }

        return new StaffDashboardStatsResponse
        {
            TotalRequests = new StatWithChange
            {
                Count = allRequests.Count,
                Change = CalculatePercentageChange(requestsCurrentMonth, requestsPreviousMonth)
            },
            PendingReview = new StatWithChange
            {
                Count = pendingReview.Count,
                Change = CalculatePercentageChange(pendingCurrentMonth, pendingPreviousMonth)
            },
            PaymentVerification = new StatWithChange
            {
                Count = paymentVerification.Count,
                Change = CalculatePercentageChange(paymentCurrentMonth, paymentPreviousMonth)
            },
            ReadyForGeneration = new StatWithChange
            {
                Count = readyForGeneration.Count,
                Change = CalculatePercentageChange(generationCurrentMonth, generationPreviousMonth)
            },
            MyProcessedToday = new StatCount
            {
                Count = myProcessedToday
            },
            CompletedToday = new StatCount
            {
                Count = completedToday
            },
            AvgProcessingTime = new AverageProcessingTime
            {
                Minutes = Math.Round(avgProcessingMinutes, 1),
                FormattedTime = FormatMinutesToReadable(avgProcessingMinutes)
            }
        };
    }

    private async Task<List<RecentActivityResponse>> GetRecentActivityAsync(int limit)
    {
        var recentRequests = await _documentRequests
            .Find(r => r.Status != "pending")
            .SortByDescending(r => r.UpdatedAt)
            .Limit(limit)
            .ToListAsync();

        var activities = new List<RecentActivityResponse>();

        foreach (var request in recentRequests)
        {
            var resident = await _residents.Find(r => r.Id == request.ResidentId).FirstOrDefaultAsync();
            var residentName = resident != null 
                ? $"{resident.FirstName} {resident.LastName}" 
                : "Unknown Resident";

            string action = request.Status switch
            {
                "approved" => "approved",
                "rejected" => "rejected",
                "payment_verified" => "verified payment",
                "completed" => "generated document",
                _ => request.Status
            };

            string? staffId = request.Status switch
            {
                "approved" or "rejected" => request.ReviewedBy,
                "payment_verified" => request.PaymentVerifiedBy,
                "completed" => request.GeneratedBy,
                _ => null
            };

            var staffName = "System";
            if (!string.IsNullOrEmpty(staffId))
            {
                var staff = await _users.Find(u => u.Id == staffId).FirstOrDefaultAsync();
                staffName = staff != null 
                    ? $"{staff.FirstName} {staff.LastName}" 
                    : "Staff Member";
            }

            // Get document type
            var document = await _documents
                .Find(d => d.Id == request.DocumentId)
                .FirstOrDefaultAsync();

            activities.Add(new RecentActivityResponse
            {
                Id = request.Id ?? string.Empty,
                Action = action,
                StaffName = staffName,
                ResidentName = residentName,
                DocumentType = document?.Name ?? "Unknown Document",
                TrackingNumber = request.TrackingNumber,
                Timestamp = request.UpdatedAt
            });
        }

        return activities;
    }

    private async Task<List<PopularDocumentResponse>> GetPopularDocumentsAsync()
    {
        var allRequests = await _documentRequests.Find(_ => true).ToListAsync();
        var totalRequests = allRequests.Count;

        if (totalRequests == 0)
        {
            return new List<PopularDocumentResponse>();
        }

        var documentGroups = allRequests
            .GroupBy(r => r.DocumentId)
            .Select(g => new { DocumentId = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(5)
            .ToList();

        var popularDocuments = new List<PopularDocumentResponse>();

        foreach (var group in documentGroups)
        {
            var document = await _documents
                .Find(d => d.Id == group.DocumentId)
                .FirstOrDefaultAsync();

            popularDocuments.Add(new PopularDocumentResponse
            {
                DocumentType = document?.Name ?? "Unknown Document",
                Count = group.Count,
                Percentage = Math.Round((double)group.Count / totalRequests * 100, 1)
            });
        }

        return popularDocuments;
    }

    private async Task<List<RequestTrendDataResponse>> GetRequestTrendsAsync(int months)
    {
        var now = DateTime.UtcNow;
        var trends = new List<RequestTrendDataResponse>();

        for (int i = months - 1; i >= 0; i--)
        {
            var monthDate = now.AddMonths(-i);
            var startOfMonth = new DateTime(monthDate.Year, monthDate.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            var count = await _documentRequests.CountDocumentsAsync(r =>
                r.CreatedAt >= startOfMonth && r.CreatedAt < endOfMonth);

            trends.Add(new RequestTrendDataResponse
            {
                Month = monthDate.ToString("MMM yyyy"),
                MonthYear = monthDate.ToString("yyyy-MM"),
                Count = (int)count
            });
        }

        return trends;
    }

    private double CalculatePercentageChange(int current, int previous)
    {
        if (previous == 0)
        {
            return current > 0 ? 100.0 : 0.0;
        }

        return Math.Round(((double)(current - previous) / previous) * 100, 1);
    }

    private double CalculatePercentageChange(decimal current, decimal previous)
    {
        if (previous == 0)
        {
            return current > 0 ? 100.0 : 0.0;
        }

        return Math.Round((double)((current - previous) / previous) * 100, 1);
    }

    private string FormatMinutesToReadable(double minutes)
    {
        if (minutes < 60)
        {
            return $"{Math.Round(minutes)}m";
        }

        var hours = Math.Floor(minutes / 60);
        var remainingMinutes = Math.Round(minutes % 60);

        if (remainingMinutes == 0)
        {
            return $"{hours}h";
        }

        return $"{hours}h {remainingMinutes}m";
    }
}
