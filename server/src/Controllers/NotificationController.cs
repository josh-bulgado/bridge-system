using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.src.Services;
using System.Security.Claims;

namespace server.src.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User ID not found");
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int limit = 50, [FromQuery] bool unreadOnly = false)
    {
        try
        {
            var userId = GetUserId();
            var notifications = await _notificationService.GetUserNotifications(userId, limit, unreadOnly);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        try
        {
            var userId = GetUserId();
            var count = await _notificationService.GetUnreadCount(userId);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPut("{notificationId}/read")]
    public async Task<IActionResult> MarkAsRead(string notificationId)
    {
        try
        {
            var userId = GetUserId();
            var success = await _notificationService.MarkAsRead(notificationId, userId);
            
            if (success)
                return Ok(new { message = "Notification marked as read" });
            
            return NotFound(new { error = "Notification not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        try
        {
            var userId = GetUserId();
            await _notificationService.MarkAllAsRead(userId);
            return Ok(new { message = "All notifications marked as read" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpDelete("{notificationId}")]
    public async Task<IActionResult> DeleteNotification(string notificationId)
    {
        try
        {
            var userId = GetUserId();
            var success = await _notificationService.DeleteNotification(notificationId, userId);
            
            if (success)
                return Ok(new { message = "Notification deleted" });
            
            return NotFound(new { error = "Notification not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // Test endpoint to verify SignalR connection with JWT
    [HttpPost("test")]
    public async Task<IActionResult> TestNotification()
    {
        try
        {
            var userId = GetUserId();
            var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "User";
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Unknown";
            
            await _notificationService.SendToUser(
                userId,
                "🔔 Test Notification",
                $"This is a test notification sent to {userName} (Role: {role}). If you see this, SignalR with JWT authentication is working correctly!",
                "info",
                "test",
                null,
                null
            );
            
            return Ok(new 
            { 
                message = "Test notification sent successfully",
                userId,
                userName,
                role,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
