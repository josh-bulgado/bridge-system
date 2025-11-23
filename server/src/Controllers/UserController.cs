
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using QRCoder;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using server.Models;
using server.Services;
using server.DTOs.User;
using System.Security.Claims;

namespace MongoBackend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly UserService _userService;
    private readonly ResidentService _residentService;

    public UserController(UserService userService, ResidentService residentService)
    {
      _userService = userService;
      _residentService = residentService;
    }

    [HttpGet]
    public async Task<List<User>> Get() =>
        await _userService.GetAsync();

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] User user)
    {
      await _userService.CreateAsync(user);
      return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
      try
      {
        // Get user ID from JWT token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { message = "User not authenticated" });
        }

        // Get user from database
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
        {
          return NotFound(new { message = "User not found" });
        }

        // Update user fields
        user.FirstName = request.FirstName;
        user.MiddleName = request.MiddleName;
        user.LastName = request.LastName;
        user.Extension = request.Extension;
        user.DateOfBirth = request.DateOfBirth;
        user.ContactNumber = request.ContactNumber;

        // Update resident address if resident exists
        if (user.Resident != null)
        {
          if (user.Resident.Address == null)
          {
            user.Resident.Address = new Address();
          }

          user.Resident.Address.Street = request.Street;
          user.Resident.Address.HouseNumberUnit = request.HouseNumber;
          user.Resident.Address.Barangay = request.Barangay;
          user.Resident.Address.City = request.City;
          user.Resident.Address.Province = request.Province;
          user.Resident.Address.ZipCode = request.ZipCode;
        }

        await _userService.UpdateAsync(userId, user);

        return Ok(new { message = "Profile updated successfully", user });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "An error occurred while updating profile", error = ex.Message });
      }
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
      try
      {
        // Get user ID from JWT token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
          return Unauthorized(new { message = "User not authenticated" });
        }

        // Get user from database
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
        {
          return NotFound(new { message = "User not found" });
        }

        // Check if user is a Google user (they can't change password)
        if (user.IsGoogleUser)
        {
          return BadRequest(new { message = "Google users cannot change password through this method" });
        }

        // Verify current password
        if (string.IsNullOrWhiteSpace(user.PasswordHash) || 
            !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
          return BadRequest(new { message = "Current password is incorrect" });
        }

        // Check if new password is same as current password
        if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.PasswordHash))
        {
          return BadRequest(new { message = "New password cannot be the same as current password" });
        }

        // Check password history
        if (await _userService.IsPasswordInHistoryAsync(userId, request.NewPassword))
        {
          return BadRequest(new { message = "Cannot use a previously used password" });
        }

        // Add current password to history
        await _userService.AddToPasswordHistoryAsync(userId, user.PasswordHash);

        // Hash and update new password
        var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.PasswordHash = newPasswordHash;

        await _userService.UpdateAsync(userId, user);

        return Ok(new { message = "Password changed successfully" });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "An error occurred while changing password", error = ex.Message });
      }
    }

    [Authorize]
    [HttpDelete("delete-account")]
    public async Task<IActionResult> DeleteAccount([FromBody] DeleteAccountRequest request)
    {
      try
      {
        // Get user ID from JWT token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userEmail))
        {
          return Unauthorized(new { message = "User not authenticated" });
        }

        // Get user from database
        var user = await _userService.GetByIdAsync(userId);
        if (user == null)
        {
          return NotFound(new { message = "User not found" });
        }

        // Security: Verify password for local users or confirmation for Google users
        if (!user.IsGoogleUser)
        {
          // Local user - verify password
          if (string.IsNullOrWhiteSpace(request.Password))
          {
            return BadRequest(new { message = "Password is required to delete your account" });
          }

          if (string.IsNullOrWhiteSpace(user.PasswordHash) || 
              !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
          {
            return BadRequest(new { message = "Incorrect password" });
          }
        }

        // Security: Verify email confirmation
        if (request.EmailConfirmation?.ToLower() != userEmail.ToLower())
        {
          return BadRequest(new { message = "Email confirmation does not match your account email" });
        }

        // Security: Check for confirmation text
        if (request.ConfirmationText?.ToUpper() != "DELETE")
        {
          return BadRequest(new { message = "Please type DELETE to confirm account deletion" });
        }

        // Delete associated resident data if exists
        if (!string.IsNullOrEmpty(user.ResidentId))
        {
          try
          {
            await _residentService.DeleteAsync(user.ResidentId);
          }
          catch (Exception ex)
          {
            // Log but continue with user deletion
            Console.WriteLine($"Error deleting resident data: {ex.Message}");
          }
        }

        // Soft delete user account (mark as deleted instead of removing)
        var deleted = await _userService.SoftDeleteUserByEmail(userEmail);
        if (!deleted)
        {
          return StatusCode(500, new { message = "Failed to delete account" });
        }

        Console.WriteLine($"[AUDIT] User {userEmail} (ID: {userId}) deleted their account at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");

        return Ok(new { message = "Account deleted successfully" });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "An error occurred while deleting account", error = ex.Message });
      }
    }
  }
}
