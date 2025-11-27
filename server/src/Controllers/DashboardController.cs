using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services;
using System.Security.Claims;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        DashboardService dashboardService,
        ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    /// <summary>
    /// Get admin dashboard statistics
    /// </summary>
    /// <returns>Admin dashboard stats including residents, staff, requests, revenue, and trends</returns>
    [HttpGet("admin")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAdminDashboardStats()
    {
        try
        {
            var stats = await _dashboardService.GetAdminDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching admin dashboard stats");
            return StatusCode(500, new { message = "An error occurred while fetching dashboard statistics" });
        }
    }

    /// <summary>
    /// Get staff dashboard statistics
    /// </summary>
    /// <returns>Staff dashboard stats including requests by status and personal performance metrics</returns>
    [HttpGet("staff")]
    [Authorize(Roles = "staff,admin")]
    public async Task<IActionResult> GetStaffDashboardStats()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var stats = await _dashboardService.GetStaffDashboardStatsAsync(userId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching staff dashboard stats");
            return StatusCode(500, new { message = "An error occurred while fetching dashboard statistics" });
        }
    }
}
