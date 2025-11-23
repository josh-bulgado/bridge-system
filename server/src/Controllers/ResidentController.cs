using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
                    request.GovernmentIdType,
                    request.GovernmentIdFront,
                    request.GovernmentIdBack,
                    request.ProofOfResidencyType,
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
        [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<List<ResidentListResponse>>> GetAllResidents()
        {
            try
            {
                var residents = await _residentService.GetAsync();

                var response = residents.Select(r =>
                {
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
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
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

                return Ok(new
                {
                    message = "Resident approved successfully",
                    resident = new
                    {
                        id = resident.Id,
                        fullName = resident.FullName,
                        verificationStatus = resident.ResidentVerificationStatus,
                        verifiedAt = resident.VerifiedAt
                    }
                });
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

                return Ok(new
                {
                    message = "Resident rejected",
                    resident = new
                    {
                        id = resident.Id,
                        fullName = resident.FullName,
                        verificationStatus = resident.ResidentVerificationStatus
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while rejecting resident", error = ex.Message });
            }
        }

        /// <summary>
        /// Get resident by ID (for staff/admin)
        /// </summary>
        [HttpGet("{residentId}")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<ResidentListResponse>> GetResidentById(string residentId)
        {
            try
            {
                var resident = await _residentService.GetByIdAsync(residentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                // Get user email for this resident
                var user = await _userService.GetByResidentIdAsync(residentId);

                var response = new ResidentListResponse
                {
                    Id = resident.Id ?? "",
                    FullName = resident.FullName,
                    Email = user?.Email ?? "N/A",
                    ContactNumber = resident.ContactNumber,
                    LocalAddress = $"{resident.Address?.HouseNumberUnit ?? ""} {resident.Address?.StreetPurok ?? ""}".Trim(),
                    VerificationStatus = resident.ResidentVerificationStatus,
                    IsEmailVerified = user?.IsEmailVerified ?? false,
                    RegistrationDate = resident.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                    VerifiedDate = resident.VerifiedAt,
                    HasDocuments = resident.VerificationDocuments != null,
                    GovernmentIdType = resident.VerificationDocuments?.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments?.GovernmentIdFront,
                    GovernmentIdBack = resident.VerificationDocuments?.GovernmentIdBack,
                    ProofOfResidencyType = resident.VerificationDocuments?.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments?.ProofOfResidency,
                    StreetPurok = resident.Address?.StreetPurok,
                    HouseNumberUnit = resident.Address?.HouseNumberUnit
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching resident", error = ex.Message });
            }
        }

        /// <summary>
        /// Search residents by query (for staff/admin)
        /// </summary>
        [HttpGet("search")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<List<ResidentListResponse>>> SearchResidents([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var residents = await _residentService.SearchByNameAsync(query);

                var response = residents.Select(r =>
                {
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
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        StreetPurok = r.Address?.StreetPurok,
                        HouseNumberUnit = r.Address?.HouseNumberUnit
                    };
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching residents", error = ex.Message });
            }
        }

        /// <summary>
        /// Get residents by verification status (for staff/admin)
        /// </summary>
        [HttpGet("status/{status}")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<List<ResidentListResponse>>> GetResidentsByStatus(string status)
        {
            try
            {
                var validStatuses = new[] { "Pending", "Approved", "Rejected", "Under Review" };
                if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = "Invalid status. Must be one of: Pending, Approved, Rejected, Under Review" });
                }

                var residents = await _residentService.GetByStatusAsync(status);

                var response = residents.Select(r =>
                {
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
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        StreetPurok = r.Address?.StreetPurok,
                        HouseNumberUnit = r.Address?.HouseNumberUnit
                    };
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching residents by status", error = ex.Message });
            }
        }

        /// <summary>
        /// Contact resident via email (for staff/admin)
        /// </summary>
        [HttpPost("{residentId}/contact")]
        // [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult> ContactResident(string residentId, [FromBody] ContactResidentRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Message))
                {
                    return BadRequest(new { message = "Message is required" });
                }

                var resident = await _residentService.GetByIdAsync(residentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                // Get user email for this resident
                var user = await _userService.GetByResidentIdAsync(residentId);
                if (user == null)
                {
                    return NotFound(new { message = "Resident user account not found" });
                }

                // TODO: Implement email sending logic here
                // For now, just return success

                return Ok(new { message = "Message sent successfully to " + resident.FullName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while contacting resident", error = ex.Message });
            }
        }

        /// <summary>
        /// Update resident information (for admin only)
        /// </summary>
        [HttpPut("{residentId}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<ResidentListResponse>> UpdateResident(string residentId, [FromBody] UpdateResidentRequest request)
        {
            try
            {
                var resident = await _residentService.GetByIdAsync(residentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                // Update resident fields if provided
                if (!string.IsNullOrEmpty(request.FirstName))
                    resident.FirstName = request.FirstName;

                if (!string.IsNullOrEmpty(request.LastName))
                    resident.LastName = request.LastName;

                if (!string.IsNullOrEmpty(request.MiddleName))
                    resident.MiddleName = request.MiddleName;

                if (!string.IsNullOrEmpty(request.ContactNumber))
                    resident.ContactNumber = request.ContactNumber;

                await _residentService.UpdateAsync(residentId, resident);

                // Get user email for this resident
                var user = await _userService.GetByResidentIdAsync(residentId);

                var response = new ResidentListResponse
                {
                    Id = resident.Id ?? "",
                    FullName = resident.FullName,
                    Email = user?.Email ?? "N/A",
                    ContactNumber = resident.ContactNumber,
                    LocalAddress = $"{resident.Address?.HouseNumberUnit ?? ""} {resident.Address?.StreetPurok ?? ""}".Trim(),
                    VerificationStatus = resident.ResidentVerificationStatus,
                    IsEmailVerified = user?.IsEmailVerified ?? false,
                    RegistrationDate = resident.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                    VerifiedDate = resident.VerifiedAt,
                    HasDocuments = resident.VerificationDocuments != null,
                    GovernmentIdType = resident.VerificationDocuments?.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments?.GovernmentIdFront,
                    GovernmentIdBack = resident.VerificationDocuments?.GovernmentIdBack,
                    ProofOfResidencyType = resident.VerificationDocuments?.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments?.ProofOfResidency,
                    StreetPurok = resident.Address?.StreetPurok,
                    HouseNumberUnit = resident.Address?.HouseNumberUnit
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating resident", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete resident (for admin only)
        /// </summary>
        [HttpDelete("{residentId}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteResident(string residentId)
        {
            try
            {
                var resident = await _residentService.GetByIdAsync(residentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                await _residentService.DeleteAsync(residentId);

                return Ok(new { message = "Resident deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting resident", error = ex.Message });
            }
        }
    }
}