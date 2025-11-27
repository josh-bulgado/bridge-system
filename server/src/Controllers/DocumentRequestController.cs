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
    private readonly DocumentGenerationService _documentGenerationService;

    public DocumentRequestController(
        DocumentRequestService documentRequestService, 
        UserService userService,
        DocumentGenerationService documentGenerationService)
    {
        _documentRequestService = documentRequestService;
        _userService = userService;
        _documentGenerationService = documentGenerationService;
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
    /// Mark document as ready for pickup
    /// </summary>
    [HttpPut("{id}/ready-for-pickup")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> MarkAsReadyForPickup(
        string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _documentRequestService.UpdateStatusAsync(id, userId, new UpdateStatusRequest
            {
                Status = "ready_for_pickup",
                Notes = "Document is ready for pickup"
            });
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Complete document request (mark as picked up)
    /// </summary>
    [HttpPut("{id}/complete")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<DocumentRequestResponse>> CompleteRequest(
        string id,
        [FromBody] CompleteDocumentRequestRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var result = await _documentRequestService.CompleteRequestAsync(id, userId, request);
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

    /// <summary>
    /// Generate preview data for document generation (Staff/Admin only)
    /// </summary>
    [HttpPost("{id}/generate-preview")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<GeneratePreviewResponse>> GeneratePreview(string id)
    {
        try
        {
            var request = await _documentRequestService.GetRequestByIdAsync(id);
            if (request == null)
            {
                return NotFound(new { message = "Document request not found" });
            }

            // Check if request is in a state that allows generation
            if (request.Status != "approved" && request.Status != "payment_verified" && request.Status != "processing")
            {
                return BadRequest(new { message = "Request must be in 'approved', 'payment_verified', or 'processing' status to generate document" });
            }

            var previewData = await _documentGenerationService.GeneratePreviewDataAsync(id);

            return Ok(new GeneratePreviewResponse
            {
                PreviewData = previewData,
                DocumentRequestId = request.Id,
                ResidentName = request.ResidentName,
                DocumentType = request.DocumentType
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Generate document from template with provided data (Staff/Admin only)
    /// </summary>
    [HttpPost("{id}/generate-document")]
    [Authorize(Roles = "staff,admin")]
    public async Task<ActionResult<GenerateDocumentResponse>> GenerateDocument(
        string id,
        [FromBody] GenerateDocumentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var documentRequest = await _documentRequestService.GetRequestByIdAsync(id);
            if (documentRequest == null)
            {
                return NotFound(new { message = "Document request not found" });
            }

            // Check if request is in a state that allows generation
            if (documentRequest.Status != "approved" && documentRequest.Status != "payment_verified" && documentRequest.Status != "processing")
            {
                return BadRequest(new { message = "Request must be in 'approved', 'payment_verified', or 'processing' status to generate document" });
            }

            var userId = GetCurrentUserId();

            // Update status to processing
            if (documentRequest.Status != "processing")
            {
                await _documentRequestService.UpdateStatusAsync(id, userId, new UpdateStatusRequest
                {
                    Status = "processing",
                    Notes = "Document generation started"
                });
            }

            // Generate the document
            var documentUrl = await _documentGenerationService.GenerateDocumentAsync(id, request.Data, userId);

            return Ok(new GenerateDocumentResponse
            {
                DocumentUrl = documentUrl,
                TrackingNumber = documentRequest.TrackingNumber,
                Message = "Document generated successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
