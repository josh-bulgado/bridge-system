using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.DocumentRequests;
using server.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentRequestController : ControllerBase
    {
        private readonly DocumentRequestService _documentRequestService;
        private readonly DocumentTypeService _documentTypeService;
        private readonly UserService _userService;
        private readonly ResidentService _residentService;

        public DocumentRequestController(
            DocumentRequestService documentRequestService,
            DocumentTypeService documentTypeService,
            UserService userService,
            ResidentService residentService)
        {
            _documentRequestService = documentRequestService;
            _documentTypeService = documentTypeService;
            _userService = userService;
            _residentService = residentService;
        }

        // GET: api/DocumentRequest
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllRequests()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated" });

            List<DocumentRequest> requests;

            // Residents can only see their own requests
            if (userRole == "resident")
            {
                requests = await _documentRequestService.GetByUserIdAsync(userId);
            }
            // Staff and Admin can see all requests
            else
            {
                requests = await _documentRequestService.GetAllAsync();
            }

            return Ok(requests);
        }

        // GET: api/DocumentRequest/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetRequestById(string id)
        {
            var request = await _documentRequestService.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { message = "Request not found" });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Residents can only view their own requests
            if (userRole == "resident" && request.UserId != userId)
                return Forbid();

            return Ok(request);
        }

        // GET: api/DocumentRequest/my-requests
        [HttpGet("my-requests")]
        [Authorize(Roles = "resident")]
        public async Task<IActionResult> GetMyRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated" });

            var requests = await _documentRequestService.GetByUserIdAsync(userId);
            return Ok(requests);
        }

        // GET: api/DocumentRequest/my-statistics
        [HttpGet("my-statistics")]
        [Authorize(Roles = "resident")]
        public async Task<IActionResult> GetMyStatistics()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated" });

            var statistics = await _documentRequestService.GetUserStatisticsAsync(userId);
            return Ok(statistics);
        }

        // GET: api/DocumentRequest/statistics
        [HttpGet("statistics")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> GetAllStatistics()
        {
            var statistics = await _documentRequestService.GetAllStatisticsAsync();
            return Ok(statistics);
        }

        // GET: api/DocumentRequest/status/{status}
        [HttpGet("status/{status}")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> GetRequestsByStatus(string status)
        {
            var requests = await _documentRequestService.GetByStatusAsync(status);
            return Ok(requests);
        }

        // POST: api/DocumentRequest
        [HttpPost]
        [Authorize(Roles = "resident")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateDocumentRequestDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated" });

            // Get user to find resident ID
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (string.IsNullOrEmpty(user.ResidentId))
                return BadRequest(new { message = "User must have a resident profile to create requests" });

            // Check if resident is verified
            var resident = await _residentService.GetByIdAsync(user.ResidentId);
            if (resident == null)
                return NotFound(new { message = "Resident profile not found" });

            // Verify document type exists
            var documentTypes = await _documentTypeService.GetActiveAsync();
            var documentType = documentTypes.FirstOrDefault(dt => dt.Name == dto.DocumentType);
            
            if (documentType == null)
                return BadRequest(new { message = "Invalid document type" });

            // Check if verification is required
            if (documentType.RequiresVerification && !resident.IsResidentVerified)
                return BadRequest(new { message = "Resident verification required for this document type" });

            // Create the request
            var request = new DocumentRequest
            {
                UserId = userId,
                ResidentId = user.ResidentId,
                DocumentType = dto.DocumentType,
                Purpose = dto.Purpose,
                Quantity = dto.Quantity,
                Status = "Pending",
                PaymentRequired = documentType.BasePrice > 0,
                PaymentAmount = documentType.BasePrice * dto.Quantity,
                PaymentStatus = documentType.BasePrice > 0 ? "Pending" : "Not Required",
                RequiredDocuments = documentType.RequiredDocuments
            };

            var createdRequest = await _documentRequestService.CreateAsync(request);
            return CreatedAtAction(nameof(GetRequestById), new { id = createdRequest.Id }, createdRequest);
        }

        // PUT: api/DocumentRequest/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> UpdateRequestStatus(string id, [FromBody] UpdateRequestStatusDto dto)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var updatedRequest = await _documentRequestService.UpdateStatusAsync(
                id, 
                dto.Status, 
                staffId, 
                dto.Comment);

            if (updatedRequest == null)
                return NotFound(new { message = "Request not found" });

            return Ok(updatedRequest);
        }

        // PUT: api/DocumentRequest/{id}/assign
        [HttpPut("{id}/assign")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> AssignRequest(string id, [FromBody] AssignRequestDto dto)
        {
            var updatedRequest = await _documentRequestService.AssignToStaffAsync(id, dto.StaffId);
            
            if (updatedRequest == null)
                return NotFound(new { message = "Request not found" });

            return Ok(updatedRequest);
        }

        // PUT: api/DocumentRequest/{id}/payment-status
        [HttpPut("{id}/payment-status")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> UpdatePaymentStatus(string id, [FromBody] UpdatePaymentStatusDto dto)
        {
            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var updatedRequest = await _documentRequestService.UpdatePaymentStatusAsync(
                id, 
                dto.PaymentStatus, 
                staffId);

            if (updatedRequest == null)
                return NotFound(new { message = "Request not found" });

            return Ok(updatedRequest);
        }

        // PUT: api/DocumentRequest/{id}/schedule-pickup
        [HttpPut("{id}/schedule-pickup")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> SchedulePickup(string id, [FromBody] SchedulePickupDto dto)
        {
            var updatedRequest = await _documentRequestService.SchedulePickupAsync(id, dto.PickupDate);
            
            if (updatedRequest == null)
                return NotFound(new { message = "Request not found" });

            return Ok(updatedRequest);
        }

        // PUT: api/DocumentRequest/{id}/reject
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "staff,admin")]
        public async Task<IActionResult> RejectRequest(string id, [FromBody] RejectRequestDto dto)
        {
            var request = await _documentRequestService.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { message = "Request not found" });

            var staffId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            request.Status = "Rejected";
            request.RejectionReason = dto.RejectionReason;
            request.StatusHistory.Add(new StatusHistory
            {
                Status = "Rejected",
                ChangedBy = staffId,
                ChangedAt = DateTime.UtcNow,
                Comment = dto.RejectionReason
            });

            var updatedRequest = await _documentRequestService.UpdateAsync(id, request);
            return Ok(updatedRequest);
        }

        // DELETE: api/DocumentRequest/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteRequest(string id)
        {
            var request = await _documentRequestService.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { message = "Request not found" });

            await _documentRequestService.DeleteAsync(id);
            return Ok(new { message = "Request deleted successfully" });
        }
    }
}
