using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Models;
using server.Services;
using server.DTOs.Staff;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _staffService;

        public StaffController(StaffService staffService)
        {
            _staffService = staffService;
        }

        /// <summary>
        /// Get all staff members
        /// </summary>
        [HttpGet]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<StaffResponse>>> GetAllStaff()
        {
            try
            {
                var staff = await _staffService.GetAllStaffAsync();
                var response = staff.Select(s => new StaffResponse
                {
                    Id = s.Id ?? "",
                    Email = s.Email,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Role = s.Role,
                    IsActive = s.IsActive,
                    IsEmailVerified = s.IsEmailVerified,
                    EmailVerifiedAt = s.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    ResidentId = s.ResidentId,
                    AuthProvider = s.AuthProvider,
                    GoogleId = s.GoogleId
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Get staff by ID
        /// </summary>
        [HttpGet("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<StaffResponse>> GetStaffById(string id)
        {
            try
            {
                var staff = await _staffService.GetStaffByIdAsync(id);
                if (staff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                var response = new StaffResponse
                {
                    Id = staff.Id ?? "",
                    Email = staff.Email,
                    FirstName = staff.FirstName,
                    LastName = staff.LastName,
                    Role = staff.Role,
                    IsActive = staff.IsActive,
                    IsEmailVerified = staff.IsEmailVerified,
                    EmailVerifiedAt = staff.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = staff.CreatedAt,
                    UpdatedAt = staff.UpdatedAt,
                    ResidentId = staff.ResidentId,
                    AuthProvider = staff.AuthProvider,
                    GoogleId = staff.GoogleId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new staff member
        /// </summary>
        [HttpPost]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<StaffResponse>> CreateStaff([FromBody] CreateStaffRequest request)
        {
            try
            {
                // Check if email already exists
                if (await _staffService.EmailExistsAsync(request.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Validate role
                if (request.Role != "admin" && request.Role != "staff")
                {
                    return BadRequest(new { message = "Invalid role. Must be 'admin' or 'staff'" });
                }

                // Use default password "Staff2024" for all new staff accounts
                var defaultPassword = "Staff2024";
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword);

                var staff = new User
                {
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PasswordHash = passwordHash,
                    Role = request.Role,
                    IsActive = request.IsActive,
                    AuthProvider = "local",
                    IsEmailVerified = true,              // Pre-verify admin-created accounts
                    EmailVerifiedAt = DateTime.UtcNow,   // Set verification timestamp
                    MustResetPassword = true             // Force password reset on first login
                };

                var createdStaff = await _staffService.CreateStaffAsync(staff);

                var response = new StaffResponse
                {
                    Id = createdStaff.Id ?? "",
                    Email = createdStaff.Email,
                    FirstName = createdStaff.FirstName,
                    LastName = createdStaff.LastName,
                    Role = createdStaff.Role,
                    IsActive = createdStaff.IsActive,
                    IsEmailVerified = createdStaff.IsEmailVerified,
                    EmailVerifiedAt = createdStaff.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = createdStaff.CreatedAt,
                    UpdatedAt = createdStaff.UpdatedAt,
                    ResidentId = createdStaff.ResidentId,
                    AuthProvider = createdStaff.AuthProvider,
                    GoogleId = createdStaff.GoogleId
                };

                return CreatedAtAction(nameof(GetStaffById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing staff member
        /// </summary>
        [HttpPut("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<StaffResponse>> UpdateStaff(string id, [FromBody] UpdateStaffRequest request)
        {
            try
            {
                var existingStaff = await _staffService.GetStaffByIdAsync(id);
                if (existingStaff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                // Check if email is being changed and if it already exists
                if (request.Email != null && request.Email != existingStaff.Email)
                {
                    if (await _staffService.EmailExistsAsync(request.Email))
                    {
                        return BadRequest(new { message = "Email already exists" });
                    }
                    existingStaff.Email = request.Email;
                }

                // Validate and update role
                if (request.Role != null)
                {
                    if (request.Role != "admin" && request.Role != "staff")
                    {
                        return BadRequest(new { message = "Invalid role. Must be 'admin' or 'staff'" });
                    }
                    existingStaff.Role = request.Role;
                }

                // Update other fields if provided
                if (request.IsActive.HasValue) existingStaff.IsActive = request.IsActive.Value;
                if (request.IsEmailVerified.HasValue)
                {
                    existingStaff.IsEmailVerified = request.IsEmailVerified.Value;
                    if (request.IsEmailVerified.Value)
                    {
                        existingStaff.EmailVerifiedAt = DateTime.UtcNow;
                    }
                }

                var updatedStaff = await _staffService.UpdateStaffAsync(id, existingStaff);
                if (updatedStaff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                var response = new StaffResponse
                {
                    Id = updatedStaff.Id ?? "",
                    Email = updatedStaff.Email,
                    FirstName = updatedStaff.FirstName,
                    LastName = updatedStaff.LastName,
                    Role = updatedStaff.Role,
                    IsActive = updatedStaff.IsActive,
                    IsEmailVerified = updatedStaff.IsEmailVerified,
                    EmailVerifiedAt = updatedStaff.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = updatedStaff.CreatedAt,
                    UpdatedAt = updatedStaff.UpdatedAt,
                    ResidentId = updatedStaff.ResidentId,
                    AuthProvider = updatedStaff.AuthProvider,
                    GoogleId = updatedStaff.GoogleId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a staff member
        /// </summary>
        [HttpDelete("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteStaff(string id)
        {
            try
            {
                var result = await _staffService.DeleteStaffAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                return Ok(new { message = "Staff member deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Toggle staff status (Activate/Deactivate)
        /// </summary>
        [HttpPatch("{id}/status")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<StaffResponse>> ToggleStaffStatus(string id, [FromBody] ToggleStaffStatusRequest request)
        {
            try
            {
                var staff = await _staffService.ToggleStaffStatusAsync(id, request.IsActive);
                if (staff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                var response = new StaffResponse
                {
                    Id = staff.Id ?? "",
                    Email = staff.Email,
                    FirstName = staff.FirstName,
                    LastName = staff.LastName,
                    Role = staff.Role,
                    IsActive = staff.IsActive,
                    IsEmailVerified = staff.IsEmailVerified,
                    EmailVerifiedAt = staff.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = staff.CreatedAt,
                    UpdatedAt = staff.UpdatedAt,
                    ResidentId = staff.ResidentId,
                    AuthProvider = staff.AuthProvider,
                    GoogleId = staff.GoogleId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while toggling staff status", error = ex.Message });
            }
        }

        /// <summary>
        /// Update staff role
        /// </summary>
        [HttpPatch("{id}/role")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<StaffResponse>> UpdateStaffRole(string id, [FromBody] UpdateStaffRoleRequest request)
        {
            try
            {
                // Validate role
                if (request.Role != "admin" && request.Role != "staff")
                {
                    return BadRequest(new { message = "Invalid role. Must be 'admin' or 'staff'" });
                }

                var staff = await _staffService.UpdateStaffRoleAsync(id, request.Role);
                if (staff == null)
                {
                    return NotFound(new { message = "Staff member not found" });
                }

                var response = new StaffResponse
                {
                    Id = staff.Id ?? "",
                    Email = staff.Email,
                    FirstName = staff.FirstName,
                    LastName = staff.LastName,
                    Role = staff.Role,
                    IsActive = staff.IsActive,
                    IsEmailVerified = staff.IsEmailVerified,
                    EmailVerifiedAt = staff.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = staff.CreatedAt,
                    UpdatedAt = staff.UpdatedAt,
                    ResidentId = staff.ResidentId,
                    AuthProvider = staff.AuthProvider,
                    GoogleId = staff.GoogleId
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating staff role", error = ex.Message });
            }
        }

        /// <summary>
        /// Get active staff only
        /// </summary>
        [HttpGet("active")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<StaffResponse>>> GetActiveStaff()
        {
            try
            {
                var staff = await _staffService.GetActiveStaffAsync();
                var response = staff.Select(s => new StaffResponse
                {
                    Id = s.Id ?? "",
                    Email = s.Email,
                    Role = s.Role,
                    IsActive = s.IsActive,
                    IsEmailVerified = s.IsEmailVerified,
                    EmailVerifiedAt = s.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    ResidentId = s.ResidentId,
                    AuthProvider = s.AuthProvider,
                    GoogleId = s.GoogleId
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching active staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Search staff by email
        /// </summary>
        [HttpGet("search")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<StaffResponse>>> SearchStaff([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var staff = await _staffService.SearchStaffByEmailAsync(query);
                var response = staff.Select(s => new StaffResponse
                {
                    Id = s.Id ?? "",
                    Email = s.Email,
                    Role = s.Role,
                    IsActive = s.IsActive,
                    IsEmailVerified = s.IsEmailVerified,
                    EmailVerifiedAt = s.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    ResidentId = s.ResidentId,
                    AuthProvider = s.AuthProvider,
                    GoogleId = s.GoogleId
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching staff", error = ex.Message });
            }
        }

        /// <summary>
        /// Get staff by role
        /// </summary>
        [HttpGet("role/{role}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<StaffResponse>>> GetStaffByRole(string role)
        {
            try
            {
                if (role != "admin" && role != "staff")
                {
                    return BadRequest(new { message = "Invalid role. Must be 'admin' or 'staff'" });
                }

                var staff = await _staffService.GetStaffByRoleAsync(role);
                var response = staff.Select(s => new StaffResponse
                {
                    Id = s.Id ?? "",
                    Email = s.Email,
                    Role = s.Role,
                    IsActive = s.IsActive,
                    IsEmailVerified = s.IsEmailVerified,
                    EmailVerifiedAt = s.EmailVerifiedAt?.ToString("yyyy-MM-dd"),
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    ResidentId = s.ResidentId,
                    AuthProvider = s.AuthProvider,
                    GoogleId = s.GoogleId
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching staff by role", error = ex.Message });
            }
        }
    }
}
