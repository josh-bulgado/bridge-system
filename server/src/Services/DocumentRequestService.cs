using MongoDB.Driver;
using server.Models;
using server.DTOs.DocumentRequests;
using Microsoft.Extensions.Options;

namespace server.Services;

public class DocumentRequestService
{
    private readonly IMongoCollection<DocumentRequest> _documentRequests;
    private readonly IMongoCollection<Resident> _residents;
    private readonly IMongoCollection<Document> _documents;
    private readonly IMongoCollection<User> _users;
    private readonly EmailService _emailService;
    private readonly DocumentService _documentService;

    public DocumentRequestService(
        MongoDBContext context,
        EmailService emailService,
        DocumentService documentService)
    {
        _documentRequests = context.GetCollection<DocumentRequest>("documentRequests");
        _residents = context.GetCollection<Resident>("residents");
        _documents = context.GetCollection<Document>("documents");
        _users = context.GetCollection<User>("users");
        _emailService = emailService;
        _documentService = documentService;
    }

    // Generate unique tracking number
    private async Task<string> GenerateTrackingNumberAsync()
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"BR-{year}-";

        // Get the latest tracking number for this year
        var latestRequest = await _documentRequests
            .Find(r => r.TrackingNumber.StartsWith(prefix))
            .SortByDescending(r => r.TrackingNumber)
            .FirstOrDefaultAsync();

        int nextNumber = 1;
        if (latestRequest != null)
        {
            // Extract the sequence number from the tracking number
            var parts = latestRequest.TrackingNumber.Split('-');
            if (parts.Length == 3 && int.TryParse(parts[2], out int currentNumber))
            {
                nextNumber = currentNumber + 1;
            }
        }

        return $"{prefix}{nextNumber:D3}"; // BR-2024-001
    }

    // Get all document requests with filtering
    public async Task<List<DocumentRequestResponse>> GetAllRequestsAsync(
        string? status = null,
        string? residentId = null,
        int? page = null,
        int? pageSize = null)
    {
        var filterBuilder = Builders<DocumentRequest>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrEmpty(status))
        {
            filter &= filterBuilder.Eq(r => r.Status, status);
        }

        if (!string.IsNullOrEmpty(residentId))
        {
            filter &= filterBuilder.Eq(r => r.ResidentId, residentId);
        }

        var query = _documentRequests.Find(filter).SortByDescending(r => r.CreatedAt);

        List<DocumentRequest> requests;
        if (page.HasValue && pageSize.HasValue)
        {
            requests = await query.Skip((page.Value - 1) * pageSize.Value).Limit(pageSize.Value).ToListAsync();
        }
        else
        {
            requests = await query.ToListAsync();
        }

        // Populate related data
        return await PopulateRequestsAsync(requests);
    }

    // Get single request by ID
    public async Task<DocumentRequestResponse?> GetRequestByIdAsync(string id)
    {
        var request = await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
        {
            return null;
        }

        var populated = await PopulateRequestsAsync(new List<DocumentRequest> { request });
        return populated.FirstOrDefault();
    }

    // Get request by tracking number
    public async Task<DocumentRequestResponse?> GetRequestByTrackingNumberAsync(string trackingNumber)
    {
        var request = await _documentRequests.Find(r => r.TrackingNumber == trackingNumber).FirstOrDefaultAsync();
        if (request == null)
        {
            return null;
        }

        var populated = await PopulateRequestsAsync(new List<DocumentRequest> { request });
        return populated.FirstOrDefault();
    }

    // Get requests by user ID (for residents to view their own requests)
    public async Task<List<DocumentRequestResponse>> GetRequestsByUserIdAsync(
        string userId,
        string? status = null,
        int? page = null,
        int? pageSize = null)
    {
        // Get user to find their residentId
        var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
        if (user == null || string.IsNullOrEmpty(user.ResidentId))
        {
            throw new Exception("User not found or not linked to a resident profile");
        }

        // Use the existing GetAllRequestsAsync method with residentId filter
        return await GetAllRequestsAsync(status, user.ResidentId, page, pageSize);
    }

    // Create new document request
    public async Task<DocumentRequestResponse> CreateRequestAsync(CreateDocumentRequestRequest dto, string? createdById = null)
    {
        // Validate resident exists
        var resident = await _residents.Find(r => r.Id == dto.ResidentId).FirstOrDefaultAsync();
        if (resident == null)
        {
            throw new Exception("Resident not found");
        }

        // Validate document exists and is active
        var document = await _documents.Find(d => d.Id == dto.DocumentId).FirstOrDefaultAsync();
        if (document == null)
        {
            throw new Exception("Document type not found");
        }

        if (document.Status != "Active")
        {
            throw new Exception("Document type is not available");
        }

        // Generate tracking number
        var trackingNumber = await GenerateTrackingNumberAsync();

        // Create request
        var request = new DocumentRequest
        {
            TrackingNumber = trackingNumber,
            ResidentId = dto.ResidentId,
            DocumentId = dto.DocumentId,
            Purpose = dto.Purpose,
            AdditionalDetails = dto.AdditionalDetails,
            PaymentMethod = dto.PaymentMethod,
            Amount = document.Price, // Snapshot current price
            PaymentProof = dto.PaymentProof,
            PaymentReferenceNumber = dto.PaymentReferenceNumber,
            SupportingDocuments = dto.SupportingDocuments,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            SubmittedAt = DateTime.UtcNow,
            StatusHistory = new List<StatusHistory>
            {
                new StatusHistory
                {
                    Status = "pending",
                    ChangedBy = createdById,
                    ChangedAt = DateTime.UtcNow,
                    Notes = "Request submitted"
                }
            }
        };

        await _documentRequests.InsertOneAsync(request);

        // Increment the total requests count for this document
        await _documentService.IncrementTotalRequestsAsync(dto.DocumentId);

        // Get resident email for notification
        var user = await _users.Find(u => u.ResidentId == dto.ResidentId).FirstOrDefaultAsync();
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            // Send confirmation email
            await _emailService.SendEmailAsync(
                user.Email,
                "Document Request Submitted",
                $@"Dear {resident.FirstName} {resident.LastName},

Your document request has been submitted successfully.

Tracking Number: {trackingNumber}
Document Type: {document.Name}
Amount: ₱{document.Price}
Status: Pending Review

You will receive an email notification once your request has been reviewed.

Thank you!"
            );
        }

        return (await GetRequestByIdAsync(request.Id!))!;
    }

    // Approve request
    public async Task<DocumentRequestResponse> ApproveRequestAsync(string id, string approvedById, ApproveDocumentRequestRequest dto)
    {
        var request = await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
        {
            throw new Exception("Request not found");
        }

        if (request.Status != "pending")
        {
            throw new Exception("Only pending requests can be approved");
        }

        var update = Builders<DocumentRequest>.Update
            .Set(r => r.Status, "approved")
            .Set(r => r.ReviewedBy, approvedById)
            .Set(r => r.ReviewedAt, DateTime.UtcNow)
            .Set(r => r.Notes, dto.Notes)
            .Set(r => r.UpdatedAt, DateTime.UtcNow)
            .Push(r => r.StatusHistory, new StatusHistory
            {
                Status = "approved",
                ChangedBy = approvedById,
                ChangedAt = DateTime.UtcNow,
                Notes = dto.Notes
            });

        await _documentRequests.UpdateOneAsync(r => r.Id == id, update);

        // Send email notification
        var resident = await _residents.Find(r => r.Id == request.ResidentId).FirstOrDefaultAsync();
        var user = await _users.Find(u => u.ResidentId == request.ResidentId).FirstOrDefaultAsync();
        var document = await _documents.Find(d => d.Id == request.DocumentId).FirstOrDefaultAsync();

        if (user != null && resident != null && document != null)
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Document Request Approved",
                $@"Dear {resident.FirstName} {resident.LastName},

Your document request has been approved!

Tracking Number: {request.TrackingNumber}
Document Type: {document.Name}
Amount: ₱{request.Amount}

Next Steps:
{(request.PaymentMethod == "online" 
    ? "Please proceed with the payment and upload your payment proof." 
    : "Please visit the barangay hall to complete the payment and processing.")}

Thank you!"
            );
        }

        return (await GetRequestByIdAsync(id))!;
    }

    // Reject request
    public async Task<DocumentRequestResponse> RejectRequestAsync(string id, string rejectedById, RejectDocumentRequestRequest dto)
    {
        var request = await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
        {
            throw new Exception("Request not found");
        }

        var update = Builders<DocumentRequest>.Update
            .Set(r => r.Status, "rejected")
            .Set(r => r.ReviewedBy, rejectedById)
            .Set(r => r.ReviewedAt, DateTime.UtcNow)
            .Set(r => r.RejectionReason, dto.RejectionReason)
            .Set(r => r.Notes, dto.Notes)
            .Set(r => r.UpdatedAt, DateTime.UtcNow)
            .Push(r => r.StatusHistory, new StatusHistory
            {
                Status = "rejected",
                ChangedBy = rejectedById,
                ChangedAt = DateTime.UtcNow,
                Reason = dto.RejectionReason,
                Notes = dto.Notes
            });

        await _documentRequests.UpdateOneAsync(r => r.Id == id, update);

        // Send email notification
        var resident = await _residents.Find(r => r.Id == request.ResidentId).FirstOrDefaultAsync();
        var user = await _users.Find(u => u.ResidentId == request.ResidentId).FirstOrDefaultAsync();
        var document = await _documents.Find(d => d.Id == request.DocumentId).FirstOrDefaultAsync();

        if (user != null && resident != null && document != null)
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Document Request Rejected",
                $@"Dear {resident.FirstName} {resident.LastName},

We regret to inform you that your document request has been rejected.

Tracking Number: {request.TrackingNumber}
Document Type: {document.Name}

Reason: {dto.RejectionReason}

If you have any questions, please contact the barangay office.

Thank you!"
            );
        }

        return (await GetRequestByIdAsync(id))!;
    }

    // Verify payment
    public async Task<DocumentRequestResponse> VerifyPaymentAsync(string id, string verifiedById, VerifyPaymentRequest dto)
    {
        var request = await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
        {
            throw new Exception("Request not found");
        }

        var update = Builders<DocumentRequest>.Update
            .Set(r => r.Status, "payment_verified")
            .Set(r => r.PaymentVerifiedBy, verifiedById)
            .Set(r => r.PaymentVerifiedAt, DateTime.UtcNow)
            .Set(r => r.UpdatedAt, DateTime.UtcNow)
            .Push(r => r.StatusHistory, new StatusHistory
            {
                Status = "payment_verified",
                ChangedBy = verifiedById,
                ChangedAt = DateTime.UtcNow,
                Notes = dto.Notes
            });

        await _documentRequests.UpdateOneAsync(r => r.Id == id, update);

        // Send email notification
        var resident = await _residents.Find(r => r.Id == request.ResidentId).FirstOrDefaultAsync();
        var user = await _users.Find(u => u.ResidentId == request.ResidentId).FirstOrDefaultAsync();
        var document = await _documents.Find(d => d.Id == request.DocumentId).FirstOrDefaultAsync();

        if (user != null && resident != null && document != null)
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Payment Verified - Document Being Processed",
                $@"Dear {resident.FirstName} {resident.LastName},

Your payment has been verified and your document is now being processed.

Tracking Number: {request.TrackingNumber}
Document Type: {document.Name}
Amount Paid: ₱{request.Amount}

You will receive another notification once your document is ready for pickup/download.

Thank you!"
            );
        }

        return (await GetRequestByIdAsync(id))!;
    }

    // Update request status (for going back to previous status or other status changes)
    public async Task<DocumentRequestResponse> UpdateStatusAsync(string id, string updatedById, UpdateStatusRequest dto)
    {
        var request = await _documentRequests.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (request == null)
        {
            throw new Exception("Request not found");
        }

        var update = Builders<DocumentRequest>.Update
            .Set(r => r.Status, dto.Status)
            .Set(r => r.UpdatedAt, DateTime.UtcNow)
            .Push(r => r.StatusHistory, new StatusHistory
            {
                Status = dto.Status,
                ChangedBy = updatedById,
                ChangedAt = DateTime.UtcNow,
                Reason = dto.Reason,
                Notes = dto.Notes
            });

        // If moving to completed, set generation info
        if (dto.Status == "completed")
        {
            update = update
                .Set(r => r.GeneratedBy, updatedById)
                .Set(r => r.GeneratedAt, DateTime.UtcNow);
        }

        await _documentRequests.UpdateOneAsync(r => r.Id == id, update);

        // Send email if completed
        if (dto.Status == "completed")
        {
            var resident = await _residents.Find(r => r.Id == request.ResidentId).FirstOrDefaultAsync();
            var user = await _users.Find(u => u.ResidentId == request.ResidentId).FirstOrDefaultAsync();
            var document = await _documents.Find(d => d.Id == request.DocumentId).FirstOrDefaultAsync();

            if (user != null && resident != null && document != null)
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Document Ready for Pickup/Download",
                    $@"Dear {resident.FirstName} {resident.LastName},

Good news! Your document is now ready.

Tracking Number: {request.TrackingNumber}
Document Type: {document.Name}

Please visit the barangay office during office hours to claim your document.

Thank you!"
                );
            }
        }

        return (await GetRequestByIdAsync(id))!;
    }

    // Helper method to populate resident, document, and user data
    private async Task<List<DocumentRequestResponse>> PopulateRequestsAsync(List<DocumentRequest> requests)
    {
        var residentIds = requests.Select(r => r.ResidentId).Distinct().ToList();
        var documentIds = requests.Select(r => r.DocumentId).Distinct().ToList();
        var userIds = requests
            .SelectMany(r => new[] { r.ReviewedBy, r.PaymentVerifiedBy, r.GeneratedBy })
            .Where(id => !string.IsNullOrEmpty(id))
            .Distinct()
            .ToList();

        // Fetch all related data in parallel
        var residentsTask = _residents.Find(r => residentIds.Contains(r.Id!)).ToListAsync();
        var documentsTask = _documents.Find(d => documentIds.Contains(d.Id!)).ToListAsync();
        var usersTask = _users.Find(u => residentIds.Contains(u.ResidentId!)).ToListAsync();
        var staffUsersTask = _users.Find(u => userIds.Contains(u.Id!)).ToListAsync();

        await Task.WhenAll(residentsTask, documentsTask, usersTask, staffUsersTask);

        var residents = await residentsTask;
        var documents = await documentsTask;
        var users = await usersTask;
        var staffUsers = await staffUsersTask;

        // Create lookup dictionaries
        var residentDict = residents.ToDictionary(r => r.Id!, r => r);
        var documentDict = documents.ToDictionary(d => d.Id!, d => d);
        var userDict = users.ToDictionary(u => u.ResidentId!, u => u);
        var staffUserDict = staffUsers.ToDictionary(u => u.Id!, u => u);

        // Map to response DTOs
        return requests.Select(request =>
        {
            residentDict.TryGetValue(request.ResidentId, out var resident);
            documentDict.TryGetValue(request.DocumentId, out var document);
            userDict.TryGetValue(request.ResidentId, out var user);

            string? reviewedByName = null;
            if (!string.IsNullOrEmpty(request.ReviewedBy) && staffUserDict.TryGetValue(request.ReviewedBy, out var reviewedByUser))
            {
                reviewedByName = reviewedByUser.Email;
            }

            string? paymentVerifiedByName = null;
            if (!string.IsNullOrEmpty(request.PaymentVerifiedBy) && staffUserDict.TryGetValue(request.PaymentVerifiedBy, out var paymentVerifiedByUser))
            {
                paymentVerifiedByName = paymentVerifiedByUser.Email;
            }

            string? generatedByName = null;
            if (!string.IsNullOrEmpty(request.GeneratedBy) && staffUserDict.TryGetValue(request.GeneratedBy, out var generatedByUser))
            {
                generatedByName = generatedByUser.Email;
            }

            return new DocumentRequestResponse
            {
                Id = request.Id!,
                TrackingNumber = request.TrackingNumber,
                ResidentId = request.ResidentId,
                ResidentName = resident != null ? $"{resident.FirstName} {resident.LastName}" : "Unknown",
                ResidentEmail = user?.Email ?? "Unknown",
                DocumentId = request.DocumentId,
                DocumentType = document?.Name ?? "Unknown",
                Purpose = request.Purpose,
                AdditionalDetails = request.AdditionalDetails,
                PaymentMethod = request.PaymentMethod,
                Amount = request.Amount,
                PaymentProof = request.PaymentProof,
                PaymentReferenceNumber = request.PaymentReferenceNumber,
                SupportingDocuments = request.SupportingDocuments,
                PaymentVerifiedBy = request.PaymentVerifiedBy,
                PaymentVerifiedByName = paymentVerifiedByName,
                PaymentVerifiedAt = request.PaymentVerifiedAt,
                Status = request.Status,
                StatusHistory = request.StatusHistory.Select(sh =>
                {
                    string? changedByName = null;
                    if (!string.IsNullOrEmpty(sh.ChangedBy) && staffUserDict.TryGetValue(sh.ChangedBy, out var changedByUser))
                    {
                        changedByName = changedByUser.Email;
                    }

                    return new StatusHistoryResponse
                    {
                        Status = sh.Status,
                        ChangedBy = sh.ChangedBy,
                        ChangedByName = changedByName,
                        ChangedAt = sh.ChangedAt,
                        Reason = sh.Reason,
                        Notes = sh.Notes
                    };
                }).ToList(),
                ReviewedBy = request.ReviewedBy,
                ReviewedByName = reviewedByName,
                ReviewedAt = request.ReviewedAt,
                RejectionReason = request.RejectionReason,
                Notes = request.Notes,
                GeneratedDocumentUrl = request.GeneratedDocumentUrl,
                GeneratedBy = request.GeneratedBy,
                GeneratedByName = generatedByName,
                GeneratedAt = request.GeneratedAt,
                CreatedAt = request.CreatedAt,
                UpdatedAt = request.UpdatedAt,
                SubmittedAt = request.SubmittedAt
            };
        }).ToList();
    }
}
