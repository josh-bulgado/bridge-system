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

                // Determine the actual status
                string actualStatus = resident.ResidentVerificationStatus;
                
                // If no documents have been submitted, status should be "Not Submitted"
                if (resident.VerificationDocuments == null)
                {
                    actualStatus = "Not Submitted";
                }

                return Ok(new VerificationStatusResponse
                {
                    IsVerified = resident.IsResidentVerified,
                    Status = actualStatus,
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

        /// <summary>
        /// Get all residents (for staff/admin)
        /// </summary>
        [HttpGet]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<List<ResidentListResponse>>> GetAllResidents()
        {
            try
            {
                var residents = await _residentService.GetAsync();
                
                var response = residents.Select(r => {
                    // Get user email for this resident
                    var user = _userService.GetByResidentIdAsync(r.Id ?? "").Result;
                    
                    return new ResidentListResponse
                    {
                        Id = r.Id ?? "",
                        FullName = r.FullName,
                        Email = user?.Email ?? "N/A",
                        ContactNumber = r.ContactNumber,
                        LocalAddress = $"{r.Address?.HouseNumberUnit ?? ""} {r.Address?.StreetPurok ?? ""}".Trim(),
                        VerificationStatus = r.ResidentVerificationStatus,
                        IsEmailVerified = user?.IsEmailVerified ?? false,
                        RegistrationDate = r.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                        VerifiedDate = r.VerifiedAt,
                        HasDocuments = r.VerificationDocuments != null,
                        // Include verification documents
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        StreetPurok = r.Address?.StreetPurok,
                        HouseNumberUnit = r.Address?.HouseNumberUnit
                    };
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching residents", error = ex.Message });
            }
        }

        /// <summary>
        /// Approve resident verification (for staff/admin)
        /// </summary>
        [HttpPost("{residentId}/approve")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult> ApproveResident(string residentId)
        {
            try
            {
                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var resident = await _residentService.ApproveResidentAsync(residentId, userId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                return Ok(new { message = "Resident approved successfully", resident = new { 
                    id = resident.Id,
                    fullName = resident.FullName,
                    verificationStatus = resident.ResidentVerificationStatus,
                    verifiedAt = resident.VerifiedAt
                }});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while approving resident", error = ex.Message });
            }
        }

        /// <summary>
        /// Reject resident verification (for staff/admin)
        /// </summary>
        [HttpPost("{residentId}/reject")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult> RejectResident(string residentId)
        {
            try
            {
                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var resident = await _residentService.RejectResidentAsync(residentId, userId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                return Ok(new { message = "Resident rejected", resident = new { 
                    id = resident.Id,
                    fullName = resident.FullName,
                    verificationStatus = resident.ResidentVerificationStatus
                }});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while rejecting resident", error = ex.Message });
            }
        }
    }
}