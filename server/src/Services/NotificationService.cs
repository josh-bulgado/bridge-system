using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using server.src.Hubs;
using server.src.Models;
using server.Services;
using server.Models;

namespace server.src.Services;

public interface INotificationService
{
    Task SendToUser(string userId, string title, string message, string type = "info", string? category = null, string? relatedEntityId = null, string? actionUrl = null);
    Task SendToRole(string role, string title, string message, string type = "info", string? category = null, string? relatedEntityId = null, string? actionUrl = null);
    Task<List<Notification>> GetUserNotifications(string userId, int limit = 50, bool unreadOnly = false);
    Task<int> GetUnreadCount(string userId);
    Task<bool> MarkAsRead(string notificationId, string userId);
    Task<bool> MarkAllAsRead(string userId);
    Task<bool> DeleteNotification(string notificationId, string userId);
    
    // Specific notification methods
    Task NotifyDocumentRequestCreated(string requestId, string residentName, string documentType);
    Task NotifyDocumentRequestStatusChanged(string userId, string requestId, string status, string documentType);
    Task NotifyVerificationStatusChanged(string userId, string status, string? reason = null);
    Task NotifyPaymentReceived(string userId, string requestId, decimal amount);
}

public class NotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IMongoCollection<Notification> _notifications;
    private readonly IMongoCollection<User> _users;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        IHubContext<NotificationHub> hubContext,
        MongoDBContext dbContext,
        ILogger<NotificationService> logger)
    {
        _hubContext = hubContext;
        _notifications = dbContext.GetCollection<Notification>("notifications");
        _users = dbContext.GetCollection<User>("users");
        _logger = logger;
    }

    public async Task SendToUser(string userId, string title, string message, string type = "info", string? category = null, string? relatedEntityId = null, string? actionUrl = null)
    {
        try
        {
            // Store notification in database
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                Category = category,
                RelatedEntityId = relatedEntityId,
                ActionUrl = actionUrl,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notifications.InsertOneAsync(notification);

            // Send real-time notification
            await _hubContext.Clients.Group($"user_{userId}").SendAsync("ReceiveNotification", new
            {
                id = notification.Id,
                title,
                message,
                type,
                category,
                relatedEntityId,
                actionUrl,
                timestamp = notification.CreatedAt
            });

            _logger.LogInformation($"Notification sent to user {userId}: {title}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to user {userId}");
        }
    }

    public async Task SendToRole(string role, string title, string message, string type = "info", string? category = null, string? relatedEntityId = null, string? actionUrl = null)
    {
        try
        {
            // Get all users with this role
            var filter = Builders<User>.Filter.Eq(u => u.Role, role);
            var usersWithRole = await _users.Find(filter).ToListAsync();

            // Create notification for each user in the role
            var notifications = new List<Notification>();
            foreach (var user in usersWithRole)
            {
                var notification = new Notification
                {
                    UserId = user.Id!,
                    Title = title,
                    Message = message,
                    Type = type,
                    Category = category,
                    RelatedEntityId = relatedEntityId,
                    ActionUrl = actionUrl,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                notifications.Add(notification);
            }

            // Store all notifications in database
            if (notifications.Count > 0)
            {
                await _notifications.InsertManyAsync(notifications);
            }

            // Send real-time notification to all users with this role via SignalR
            await _hubContext.Clients.Group($"role_{role}").SendAsync("ReceiveNotification", new
            {
                title,
                message,
                type,
                category,
                relatedEntityId,
                actionUrl,
                timestamp = DateTime.UtcNow
            });

            _logger.LogInformation($"Notification sent to role {role}: {title} ({usersWithRole.Count} users)");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending notification to role {role}");
        }
    }

    public async Task<List<Notification>> GetUserNotifications(string userId, int limit = 50, bool unreadOnly = false)
    {
        var filter = unreadOnly 
            ? Builders<Notification>.Filter.And(
                Builders<Notification>.Filter.Eq(n => n.UserId, userId),
                Builders<Notification>.Filter.Eq(n => n.IsRead, false))
            : Builders<Notification>.Filter.Eq(n => n.UserId, userId);

        return await _notifications.Find(filter)
            .SortByDescending(n => n.CreatedAt)
            .Limit(limit)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCount(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Notification>.Filter.Eq(n => n.IsRead, false));

        return (int)await _notifications.CountDocumentsAsync(filter);
    }

    public async Task<bool> MarkAsRead(string notificationId, string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.Id, notificationId),
            Builders<Notification>.Filter.Eq(n => n.UserId, userId));

        var update = Builders<Notification>.Update
            .Set(n => n.IsRead, true)
            .Set(n => n.ReadAt, DateTime.UtcNow);

        var result = await _notifications.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> MarkAllAsRead(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.UserId, userId),
            Builders<Notification>.Filter.Eq(n => n.IsRead, false));

        var update = Builders<Notification>.Update
            .Set(n => n.IsRead, true)
            .Set(n => n.ReadAt, DateTime.UtcNow);

        var result = await _notifications.UpdateManyAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteNotification(string notificationId, string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(n => n.Id, notificationId),
            Builders<Notification>.Filter.Eq(n => n.UserId, userId));

        var result = await _notifications.DeleteOneAsync(filter);
        return result.DeletedCount > 0;
    }

    // Specific notification methods
    public async Task NotifyDocumentRequestCreated(string requestId, string residentName, string documentType)
    {
        await SendToRole(
            "Staff",
            "New Document Request",
            $"{residentName} submitted a request for {documentType}",
            "info",
            "document_request",
            requestId,
            $"/staff/requests/{requestId}"
        );

        await SendToRole(
            "Admin",
            "New Document Request",
            $"{residentName} submitted a request for {documentType}",
            "info",
            "document_request",
            requestId,
            $"/admin/requests/{requestId}"
        );
    }

    public async Task NotifyDocumentRequestStatusChanged(string userId, string requestId, string status, string documentType)
    {
        var (title, message, type, actionUrl) = status.ToLower() switch
        {
            "approved" => (
                "Request Approved",
                $"Your {documentType} request has been approved and is being processed",
                "success",
                $"/resident/requests/{requestId}"
            ),
            "rejected" => (
                "Request Rejected",
                $"Your {documentType} request has been rejected. Please check the details for more information",
                "error",
                $"/resident/requests/{requestId}"
            ),
            "ready" => (
                "Document Ready!",
                $"Your {documentType} is ready for pickup at the barangay office",
                "success",
                $"/resident/requests/{requestId}"
            ),
            "processing" => (
                "Request Processing",
                $"Your {documentType} request is now being processed",
                "info",
                $"/resident/requests/{requestId}"
            ),
            _ => (
                "Status Update",
                $"Your {documentType} request status has been updated to: {status}",
                "info",
                $"/resident/requests/{requestId}"
            )
        };

        await SendToUser(userId, title, message, type, "document_request", requestId, actionUrl);
    }

    public async Task NotifyVerificationStatusChanged(string userId, string status, string? reason = null)
    {
        var (title, message, type) = status.ToLower() switch
        {
            "verified" => (
                "Account Verified!",
                "Your account has been verified. You can now submit document requests",
                "success"
            ),
            "rejected" => (
                "Verification Rejected",
                reason ?? "Your verification was rejected. Please resubmit with correct information",
                "error"
            ),
            _ => (
                "Verification Update",
                $"Your verification status: {status}",
                "info"
            )
        };

        await SendToUser(userId, title, message, type, "verification", null, "/resident/verification");
    }

    public async Task NotifyPaymentReceived(string userId, string requestId, decimal amount)
    {
        await SendToUser(
            userId,
            "Payment Received",
            $"Your payment of ₱{amount:N2} has been received and verified",
            "success",
            "payment",
            requestId,
            $"/resident/requests/{requestId}"
        );
    }
}
