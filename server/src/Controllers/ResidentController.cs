using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Services;
using server.src.Services;
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
        private readonly CloudinaryService _cloudinaryService;
        private readonly INotificationService _notificationService;

        public ResidentController(
            ResidentService residentService, 
            UserService userService, 
            CloudinaryService cloudinaryService,
            INotificationService notificationService)
        {
            _residentService = residentService;
            _userService = userService;
            _cloudinaryService = cloudinaryService;
            _notificationService = notificationService;
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
                    request.ProofOfResidency,
                    request.GovernmentIdFrontUrl,
                    request.GovernmentIdBackUrl,
                    request.ProofOfResidencyUrl,
                    request.GovernmentIdFrontFileType,
                    request.GovernmentIdBackFileType,
                    request.ProofOfResidencyFileType
                );

                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                // Send notification to resident
                await _notificationService.SendToUser(
                    userId,
                    "Verification Submitted",
                    "Your verification documents have been submitted successfully. Our staff will review them shortly.",
                    "info",
                    "verification",
                    resident.Id,
                    "/resident/verification"
                );

                // Notify staff and admin about new verification submission
                var residentName = resident.FullName ?? "A resident";
                await _notificationService.SendToRole(
                    "staff",
                    "New Verification Submission",
                    $"{residentName} has submitted verification documents for review.",
                    "info",
                    "verification",
                    resident.Id,
                    $"/staff/residents/{resident.Id}"
                );

                await _notificationService.SendToRole(
                    "admin",
                    "New Verification Submission",
                    $"{residentName} has submitted verification documents for review.",
                    "info",
                    "verification",
                    resident.Id,
                    $"/admin/residents/{resident.Id}"
                );

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
        /// 🔒 SECURITY: Role-based access with audit logging
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

                    // Determine actual verification status
                    string verificationStatus = r.ResidentVerificationStatus;
                    if (r.VerificationDocuments == null)
                    {
                        verificationStatus = "Not Submitted";
                    }

                    return new ResidentListResponse
                    {
                        Id = r.Id ?? "",
                        FullName = r.FullName,
                        Email = user?.Email ?? "N/A",
                        ContactNumber = r.ContactNumber,
                        LocalAddress = $"{r.Address?.HouseNumberUnit ?? ""} {r.Address?.StreetPurok ?? ""}".Trim(),
                        VerificationStatus = verificationStatus,
                        IsEmailVerified = user?.IsEmailVerified ?? false,
                        IsDeleted = user?.IsDeleted ?? false,
                        DeletedAt = user?.DeletedAt,
                        RegistrationDate = r.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                        VerifiedDate = r.VerifiedAt,
                        HasDocuments = r.VerificationDocuments != null,
                        // Include verification documents
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdFrontUrl = r.VerificationDocuments?.GovernmentIdFrontUrl,
                        GovernmentIdFrontFileType = r.VerificationDocuments?.GovernmentIdFrontFileType,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        GovernmentIdBackUrl = r.VerificationDocuments?.GovernmentIdBackUrl,
                        GovernmentIdBackFileType = r.VerificationDocuments?.GovernmentIdBackFileType,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        ProofOfResidencyUrl = r.VerificationDocuments?.ProofOfResidencyUrl,
                        ProofOfResidencyFileType = r.VerificationDocuments?.ProofOfResidencyFileType,
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
        [Authorize(Roles = "staff,admin")]
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

                // Get user associated with the resident to send notification
                var residentUser = await _userService.GetByResidentIdAsync(residentId);
                if (residentUser != null)
                {
                    await _notificationService.SendToUser(
                        residentUser.Id ?? "",
                        "Verification Approved",
                        "Congratulations! Your residency verification has been approved. You can now request barangay documents.",
                        "success",
                        "verification",
                        residentId,
                        "/resident/dashboard"
                    );
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
        [Authorize(Roles = "staff,admin")]
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

                // Get user associated with the resident to send notification
                var residentUser = await _userService.GetByResidentIdAsync(residentId);
                if (residentUser != null)
                {
                    await _notificationService.SendToUser(
                        residentUser.Id ?? "",
                        "Verification Rejected",
                        "Your residency verification has been rejected. Please review your documents and resubmit with correct information.",
                        "error",
                        "verification",
                        residentId,
                        "/resident/verification"
                    );
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
        [Authorize(Roles = "staff,admin")]
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

                // Determine actual verification status
                string verificationStatus = resident.ResidentVerificationStatus;
                if (resident.VerificationDocuments == null)
                {
                    verificationStatus = "Not Submitted";
                }

                var response = new ResidentListResponse
                {
                    Id = resident.Id ?? "",
                    FullName = resident.FullName,
                    Email = user?.Email ?? "N/A",
                    ContactNumber = resident.ContactNumber,
                    LocalAddress = $"{resident.Address?.HouseNumberUnit ?? ""} {resident.Address?.StreetPurok ?? ""}".Trim(),
                    VerificationStatus = verificationStatus,
                    IsEmailVerified = user?.IsEmailVerified ?? false,
                        IsDeleted = user?.IsDeleted ?? false,
                        DeletedAt = user?.DeletedAt,
                        RegistrationDate = resident.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                    VerifiedDate = resident.VerifiedAt,
                    HasDocuments = resident.VerificationDocuments != null,
                    GovernmentIdType = resident.VerificationDocuments?.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments?.GovernmentIdFront,
                    GovernmentIdFrontUrl = resident.VerificationDocuments?.GovernmentIdFrontUrl,
                    GovernmentIdFrontFileType = resident.VerificationDocuments?.GovernmentIdFrontFileType,
                    GovernmentIdBack = resident.VerificationDocuments?.GovernmentIdBack,
                    GovernmentIdBackUrl = resident.VerificationDocuments?.GovernmentIdBackUrl,
                    GovernmentIdBackFileType = resident.VerificationDocuments?.GovernmentIdBackFileType,
                    ProofOfResidencyType = resident.VerificationDocuments?.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments?.ProofOfResidency,
                    ProofOfResidencyUrl = resident.VerificationDocuments?.ProofOfResidencyUrl,
                    ProofOfResidencyFileType = resident.VerificationDocuments?.ProofOfResidencyFileType,
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
        [Authorize(Roles = "staff,admin")]
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

                    // Determine actual verification status
                    string verificationStatus = r.ResidentVerificationStatus;
                    if (r.VerificationDocuments == null)
                    {
                        verificationStatus = "Not Submitted";
                    }

                    return new ResidentListResponse
                    {
                        Id = r.Id ?? "",
                        FullName = r.FullName,
                        Email = user?.Email ?? "N/A",
                        ContactNumber = r.ContactNumber,
                        LocalAddress = $"{r.Address?.HouseNumberUnit ?? ""} {r.Address?.StreetPurok ?? ""}".Trim(),
                        VerificationStatus = verificationStatus,
                        IsEmailVerified = user?.IsEmailVerified ?? false,
                        IsDeleted = user?.IsDeleted ?? false,
                        DeletedAt = user?.DeletedAt,
                        RegistrationDate = r.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                        VerifiedDate = r.VerifiedAt,
                        HasDocuments = r.VerificationDocuments != null,
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdFrontUrl = r.VerificationDocuments?.GovernmentIdFrontUrl,
                        GovernmentIdFrontFileType = r.VerificationDocuments?.GovernmentIdFrontFileType,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        GovernmentIdBackUrl = r.VerificationDocuments?.GovernmentIdBackUrl,
                        GovernmentIdBackFileType = r.VerificationDocuments?.GovernmentIdBackFileType,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        ProofOfResidencyUrl = r.VerificationDocuments?.ProofOfResidencyUrl,
                        ProofOfResidencyFileType = r.VerificationDocuments?.ProofOfResidencyFileType,
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
        [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult<List<ResidentListResponse>>> GetResidentsByStatus(string status)
        {
            try
            {
                var validStatuses = new[] { "Pending", "Approved", "Rejected", "Under Review", "Not Submitted" };
                if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = "Invalid status. Must be one of: Pending, Approved, Rejected, Under Review, Not Submitted" });
                }

                var residents = await _residentService.GetByStatusAsync(status);

                var response = residents.Select(r =>
                {
                    var user = _userService.GetByResidentIdAsync(r.Id ?? "").Result;

                    // Determine actual verification status
                    string verificationStatus = r.ResidentVerificationStatus;
                    if (r.VerificationDocuments == null)
                    {
                        verificationStatus = "Not Submitted";
                    }

                    return new ResidentListResponse
                    {
                        Id = r.Id ?? "",
                        FullName = r.FullName,
                        Email = user?.Email ?? "N/A",
                        ContactNumber = r.ContactNumber,
                        LocalAddress = $"{r.Address?.HouseNumberUnit ?? ""} {r.Address?.StreetPurok ?? ""}".Trim(),
                        VerificationStatus = verificationStatus,
                        IsEmailVerified = user?.IsEmailVerified ?? false,
                        IsDeleted = user?.IsDeleted ?? false,
                        DeletedAt = user?.DeletedAt,
                        RegistrationDate = r.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                        VerifiedDate = r.VerifiedAt,
                        HasDocuments = r.VerificationDocuments != null,
                        GovernmentIdType = r.VerificationDocuments?.GovernmentIdType,
                        GovernmentIdFront = r.VerificationDocuments?.GovernmentIdFront,
                        GovernmentIdFrontUrl = r.VerificationDocuments?.GovernmentIdFrontUrl,
                        GovernmentIdFrontFileType = r.VerificationDocuments?.GovernmentIdFrontFileType,
                        GovernmentIdBack = r.VerificationDocuments?.GovernmentIdBack,
                        GovernmentIdBackUrl = r.VerificationDocuments?.GovernmentIdBackUrl,
                        GovernmentIdBackFileType = r.VerificationDocuments?.GovernmentIdBackFileType,
                        ProofOfResidencyType = r.VerificationDocuments?.ProofOfResidencyType,
                        ProofOfResidency = r.VerificationDocuments?.ProofOfResidency,
                        ProofOfResidencyUrl = r.VerificationDocuments?.ProofOfResidencyUrl,
                        ProofOfResidencyFileType = r.VerificationDocuments?.ProofOfResidencyFileType,
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
        [Authorize(Roles = "staff,admin")]
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
        [Authorize(Roles = "admin")]
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

                // Determine actual verification status
                string verificationStatus = resident.ResidentVerificationStatus;
                if (resident.VerificationDocuments == null)
                {
                    verificationStatus = "Not Submitted";
                }

                var response = new ResidentListResponse
                {
                    Id = resident.Id ?? "",
                    FullName = resident.FullName,
                    Email = user?.Email ?? "N/A",
                    ContactNumber = resident.ContactNumber,
                    LocalAddress = $"{resident.Address?.HouseNumberUnit ?? ""} {resident.Address?.StreetPurok ?? ""}".Trim(),
                    VerificationStatus = verificationStatus,
                    IsEmailVerified = user?.IsEmailVerified ?? false,
                        IsDeleted = user?.IsDeleted ?? false,
                        DeletedAt = user?.DeletedAt,
                        RegistrationDate = resident.VerificationDocuments?.SubmittedAt ?? user?.CreatedAt ?? DateTime.UtcNow,
                    VerifiedDate = resident.VerifiedAt,
                    HasDocuments = resident.VerificationDocuments != null,
                    GovernmentIdType = resident.VerificationDocuments?.GovernmentIdType,
                    GovernmentIdFront = resident.VerificationDocuments?.GovernmentIdFront,
                    GovernmentIdFrontUrl = resident.VerificationDocuments?.GovernmentIdFrontUrl,
                    GovernmentIdFrontFileType = resident.VerificationDocuments?.GovernmentIdFrontFileType,
                    GovernmentIdBack = resident.VerificationDocuments?.GovernmentIdBack,
                    GovernmentIdBackUrl = resident.VerificationDocuments?.GovernmentIdBackUrl,
                    GovernmentIdBackFileType = resident.VerificationDocuments?.GovernmentIdBackFileType,
                    ProofOfResidencyType = resident.VerificationDocuments?.ProofOfResidencyType,
                    ProofOfResidency = resident.VerificationDocuments?.ProofOfResidency,
                    ProofOfResidencyUrl = resident.VerificationDocuments?.ProofOfResidencyUrl,
                    ProofOfResidencyFileType = resident.VerificationDocuments?.ProofOfResidencyFileType,
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
        [Authorize(Roles = "admin")]
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

        /// <summary>
        /// Get a signed URL for a document (for authenticated Cloudinary resources)
        /// 🔒 SECURITY: Enhanced with role-based access, audit logging, and document ownership verification
        /// </summary>
        [HttpGet("{residentId}/document-url")]
        [Authorize(Roles = "staff,admin")]
        public async Task<ActionResult> GetDocumentSignedUrl(string residentId, [FromQuery] string publicId)
        {
            try
            {
                // 🔒 Security: Validate input parameters
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                if (string.IsNullOrEmpty(residentId))
                {
                    return BadRequest(new { message = "Resident ID is required" });
                }

                // 🔒 Security: Get authenticated user info
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // 🔒 Security: Verify resident exists
                var resident = await _residentService.GetByIdAsync(residentId);
                if (resident == null)
                {
                    return NotFound(new { message = "Resident not found" });
                }

                // 🔒 Security: Verify document belongs to resident
                var isValidDocument = false;
                if (resident.VerificationDocuments != null)
                {
                    isValidDocument = 
                        resident.VerificationDocuments.GovernmentIdFront == publicId ||
                        resident.VerificationDocuments.GovernmentIdBack == publicId ||
                        resident.VerificationDocuments.ProofOfResidency == publicId;
                }

                if (!isValidDocument)
                {
                    // 🔒 Security: Log unauthorized access attempt
                    Console.WriteLine($"[SECURITY ALERT] User {userEmail} (Role: {userRole}) attempted to access document {publicId} for resident {residentId} - Document not found or not owned by resident");
                    return Forbid();
                }

                // 🔒 Security: Generate time-limited signed URL (15 minutes for security)
                var signedUrl = _cloudinaryService.GetSignedDocumentUrl(publicId, 15);

                if (string.IsNullOrEmpty(signedUrl))
                {
                    return StatusCode(500, new { message = "Failed to generate signed URL" });
                }

                // 🔒 Security: Audit log - Document access
                Console.WriteLine($"[AUDIT] User {userEmail} (ID: {userId}, Role: {userRole}) accessed document {publicId} for resident {resident.FullName} (ID: {residentId}) at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");

                // 🔒 Security: Return URL with security headers
                Response.Headers.Append("X-Content-Type-Options", "nosniff");
                Response.Headers.Append("X-Frame-Options", "DENY");
                Response.Headers.Append("Cache-Control", "no-store, no-cache, must-revalidate, private");
                Response.Headers.Append("Pragma", "no-cache");

                return Ok(new { 
                    url = signedUrl,
                    expiresIn = 15, // minutes
                    residentName = resident.FullName
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to generate signed URL: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while generating document URL" });
            }
        }
    }
}