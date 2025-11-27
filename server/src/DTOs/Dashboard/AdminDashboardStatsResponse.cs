namespace server.DTOs.Dashboard;

public class AdminDashboardStatsResponse
{
    public StatWithChange TotalResidents { get; set; } = new();
    public StatWithChange VerifiedResidents { get; set; } = new();
    public StatCount PendingVerifications { get; set; } = new();
    public StatCount ActiveStaff { get; set; } = new();
    public StatWithChange TotalDocumentsIssued { get; set; } = new();
    public StatWithChange TotalRequests { get; set; } = new();
    public StatCount PendingRequests { get; set; } = new();
    public RevenueStatWithChange TotalRevenue { get; set; } = new();
    public List<RecentActivityResponse> RecentActivity { get; set; } = new();
    public List<PopularDocumentResponse> PopularDocuments { get; set; } = new();
    public List<RequestTrendDataResponse> RequestTrends { get; set; } = new();
}

public class StaffDashboardStatsResponse
{
    public StatWithChange TotalRequests { get; set; } = new();
    public StatWithChange PendingReview { get; set; } = new();
    public StatWithChange PaymentVerification { get; set; } = new();
    public StatWithChange ReadyForGeneration { get; set; } = new();
    public StatCount MyProcessedToday { get; set; } = new();
    public StatCount CompletedToday { get; set; } = new();
    public AverageProcessingTime AvgProcessingTime { get; set; } = new();
}

public class StatWithChange
{
    public int Count { get; set; }
    public double Change { get; set; } // Percentage change from previous period
}

public class StatCount
{
    public int Count { get; set; }
}

public class RevenueStatWithChange
{
    public decimal Amount { get; set; }
    public double Change { get; set; } // Percentage change from previous period
}

public class AverageProcessingTime
{
    public double Minutes { get; set; }
    public string FormattedTime { get; set; } = string.Empty; // e.g., "2h 30m"
}

public class RecentActivityResponse
{
    public string Id { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // "approved", "rejected", "generated", etc.
    public string StaffName { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string TrackingNumber { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class PopularDocumentResponse
{
    public string DocumentType { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; } // Percentage of total requests
}

public class RequestTrendDataResponse
{
    public string Month { get; set; } = string.Empty; // e.g., "Jan 2024"
    public int Count { get; set; }
    public string MonthYear { get; set; } = string.Empty; // For grouping/sorting
}
