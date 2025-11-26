using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Services;
using server.DTOs.DocumentRequests;
using System.Security.Claims;

namespace server.Controllers;

[ApiController]
[Route("api/document-requests")]
[Authorize]
public class DocumentRequestController : ControllerBase
{
    private readonly DocumentRequestService _documentRequestService;
    private readonly UserService _userService;

    public DocumentRequestController(DocumentRequestService documentRequestService, UserService userService)
    {
        _documentRequestService = documentRequestService;
        _userService = userService;
    }

    // Helper to get current user ID from JWT
    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? throw new UnauthorizedAccessException("User ID not found in token");
    }

    // Helper to check if user is staff or admin
    private bool IsStaffOrAdmin()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        return role == "staff" || role == "admin";
    }

    /// <summary>
    /// Get all document requests (Staff/Admin only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<List<DocumentRequestResponse>>> GetAllRequests(
        [FromQuery] string? status = null,
        [FromQuery] string? residentId = null,
        [FromQuery] int? page = null,
        [FromQuery] int? pageSize = null)
    {
        try
        {
            var requests = await _documentRequestService.GetAllRequestsAsync(status, residentId, page, pageSize);
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get single document request by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentRequestResponse>> GetRequestById(string id)
    {
        try
        {
            var request = await _documentRequestService.GetRequestByIdAsync(id);
            if (request == null)
            {
                return NotFound(new { message = "Document request not found" });
            }

            // Residents can only view their own requests
            if (!IsStaffOrAdmin())
            {
                var userId = GetCurrentUserId();
                // Get the user to find their residentId
                var user = await _userService.GetByIdAsync(userId);
                if (user == null || string.IsNullOrEmpty(user.ResidentId))
                {
                    return Forbid();
                }
                
                // Check if the request belongs to this resident
                if (request.ResidentId != user.ResidentId)
                {
                    return Forbid();
                }
            }

            return Ok(request);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get document request by tracking number
    /// </summary>
    [HttpGet("tracking/{trackingNumber}")]
    public async Task<ActionResult<DocumentRequestResponse>> GetRequestByTrackingNumber(string trackingNumber)
    {
        try
        {
            var request = await _documentRequestService.GetRequestByTrackingNumberAsync(trackingNumber);
            if (request == null)
            {
                return NotFound(new { message = "Document request not found" });
            }

            // Residents can only view their own requests
            if (!IsStaffOrAdmin())
            {
                var userId = GetCurrentUserId();
                // TODO: Get user's residentId and check if it matches request.ResidentId
                return Forbid();
            }

            return Ok(request);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create new document request (Staff/Admin can create on behalf of residents)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> CreateRequest([FromBody] CreateDocumentRequestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.CreateRequestAsync(request, userId);
            return CreatedAtAction(nameof(GetRequestById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create new document request by resident (Resident role only)
    /// </summary>
    [HttpPost("resident")]
    [Authorize(Roles = "resident")]
    public async Task<ActionResult<DocumentRequestResponse>> CreateResidentRequest([FromBody] CreateDocumentRequestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.CreateRequestAsync(request, userId);
            return CreatedAtAction(nameof(GetRequestById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get all document requests for the logged-in resident
    /// </summary>
    [HttpGet("my-requests")]
    [Authorize(Roles = "resident")]
    public async Task<ActionResult<List<DocumentRequestResponse>>> GetMyRequests(
        [FromQuery] string? status = null,
        [FromQuery] int? page = null,
        [FromQuery] int? pageSize = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            // Get user's resident ID from the service
            var requests = await _documentRequestService.GetRequestsByUserIdAsync(userId, status, page, pageSize);
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Approve document request
    /// </summary>
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> ApproveRequest(
        string id,
        [FromBody] ApproveDocumentRequestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.ApproveRequestAsync(id, userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Reject document request
    /// </summary>
    [HttpPut("{id}/reject")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> RejectRequest(
        string id,
        [FromBody] RejectDocumentRequestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.RejectRequestAsync(id, userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Verify payment for document request
    /// </summary>
    [HttpPut("{id}/verify-payment")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> VerifyPayment(
        string id,
        [FromBody] VerifyPaymentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.VerifyPaymentAsync(id, userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update request status (for status changes including going back to previous status)
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> UpdateStatus(
        string id,
        [FromBody] UpdateStatusRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.UpdateStatusAsync(id, userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Cancel document request (Resident only - can cancel their own pending requests)
    /// </summary>
    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "resident")]
    public async Task<ActionResult<DocumentRequestResponse>> CancelRequest(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var request = await _documentRequestService.GetRequestByIdAsync(id);
            
            if (request == null)
            {
                return NotFound(new { message = "Document request not found" });
            }

            // Get the user to find their residentId
            var user = await _userService.GetByIdAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.ResidentId))
            {
                return Forbid();
            }

            // Check if request belongs to this resident
            if (request.ResidentId != user.ResidentId)
            {
                return Forbid();
            }

            // Only allow cancellation for pending or payment_pending status
            if (request.Status != "pending" && request.Status != "payment_pending")
            {
                return BadRequest(new { message = "Cannot cancel request in current status. Only 'pending' or 'payment_pending' requests can be cancelled." });
            }

            var result = await _documentRequestService.UpdateStatusAsync(id, userId, new UpdateStatusRequest 
            { 
                Status = "cancelled",
                Notes = "Cancelled by resident"
            });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
