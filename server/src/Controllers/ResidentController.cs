using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Models;
using server.Services;
using server.DTOs.Residents;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResidentController : ControllerBase
    {
        private readonly ResidentService _residentService;
        private readonly UserService _userService;

        public ResidentController(ResidentService residentService, UserService userService)
        {
            _residentService = residentService;
            _userService = userService;
        }

        /// <summary>
        /// Submit verification request with documents
        /// </summary>
        [HttpPost("verification")]
        // [Authorize(Roles = "resident")]
        public async Task<ActionResult<VerificationResponse>> SubmitVerification([FromBody] SubmitVerificationRequest request)
        {
            
            try
            {
                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // Get user to find associated resident
                var user = await _userService.GetByIdAsync(userId);
                if (user == null || string.IsNullOrEmpty(user.ResidentId))
                {
                    return NotFound(new { message = "Resident profile not found" });
                }

                // Submit verification
                var resident = await _residentService.SubmitVerificationAsync(
                    user.ResidentId,
                    request.StreetPurok,
                    request.HouseNumberUnit,
                    request.GovernmentIdFront,
                    request.GovernmentIdBack,
                    request.ProofOfResidency
                );

                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                return Ok(new VerificationResponse
                {
                    Id = resident.Id ?? "",
                    Status = resident.ResidentVerificationStatus,
                    Message = "Verification request submitted successfully",
                    SubmittedAt = resident.VerificationDocuments?.SubmittedAt ?? DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting verification", error = ex.Message });
            }
        }

        /// <summary>
        /// Get verification status for current user
        /// </summary>
        [HttpGet("verification/status")]
        // [Authorize(Roles = "resident")]
        public async Task<ActionResult<VerificationStatusResponse>> GetVerificationStatus()
        {
            try
            {
                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // Get user to find associated resident
                var user = await _userService.GetByIdAsync(userId);
                if (user == null || string.IsNullOrEmpty(user.ResidentId))
                {
                    return NotFound(new { message = "Resident profile not found" });
                }

                var resident = await _residentService.GetByIdAsync(user.ResidentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                return Ok(new VerificationStatusResponse
                {
                    IsVerified = resident.IsResidentVerified,
                    Status = resident.ResidentVerificationStatus,
                    SubmittedAt = resident.VerificationDocuments?.SubmittedAt,
                    VerifiedAt = resident.VerifiedAt,
                    VerifiedBy = resident.VerifiedBy
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching verification status", error = ex.Message });
            }
        }
    }
}