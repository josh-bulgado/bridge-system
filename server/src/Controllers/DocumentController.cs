using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.Models;
using server.Services;
using server.DTOs.Documents;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly DocumentService _documentService;
        private readonly MongoDBContext _context;

        public DocumentController(DocumentService documentService, MongoDBContext context)
        {
            _documentService = documentService;
            _context = context;
        }

        /// <summary>
        /// Get all documents
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<DocumentResponse>>> GetAllDocuments()
        {
            try
            {
                var documents = await _documentService.GetAllAsync();
                var response = documents.Select(doc => new DocumentResponse
                {
                    Id = doc.Id ?? "",
                    Name = doc.Name,
                    Price = doc.Price,
                    Requirements = doc.Requirements,
                    Status = doc.Status,
                    ProcessingTime = doc.ProcessingTime,
                    TemplateUrl = doc.TemplateUrl,
                    TotalRequests = doc.TotalRequests,
                    LastModified = doc.LastModified,
                    CreatedAt = doc.CreatedAt,
                    UpdatedAt = doc.UpdatedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Get document by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<DocumentResponse>> GetDocumentById(string id)
        {
            try
            {
                var document = await _documentService.GetByIdAsync(id);
                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                var response = new DocumentResponse
                {
                    Id = document.Id ?? "",
                    Name = document.Name,
                    Price = document.Price,
                    Requirements = document.Requirements,
                    Status = document.Status,
                    ProcessingTime = document.ProcessingTime,
                    TemplateUrl = document.TemplateUrl,
                    TotalRequests = document.TotalRequests,
                    LastModified = document.LastModified,
                    CreatedAt = document.CreatedAt,
                    UpdatedAt = document.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching document", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new document
        /// </summary>
        [HttpPost]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<DocumentResponse>> CreateDocument([FromBody] CreateDocumentRequest request)
        {
            try
            {
                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var document = new Document
                {
                    Name = request.Name,
                    Price = request.Price,
                    Requirements = request.Requirements,
                    Status = request.Status,
                    ProcessingTime = request.ProcessingTime,
                    TemplateUrl = request.TemplateUrl
                };

                var createdDocument = await _documentService.CreateAsync(document, userId);

                var response = new DocumentResponse
                {
                    Id = createdDocument.Id ?? "",
                    Name = createdDocument.Name,
                    Price = createdDocument.Price,
                    Requirements = createdDocument.Requirements,
                    Status = createdDocument.Status,
                    ProcessingTime = createdDocument.ProcessingTime,
                    TemplateUrl = createdDocument.TemplateUrl,
                    TotalRequests = createdDocument.TotalRequests,
                    LastModified = createdDocument.LastModified,
                    CreatedAt = createdDocument.CreatedAt,
                    UpdatedAt = createdDocument.UpdatedAt
                };

                return CreatedAtAction(nameof(GetDocumentById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating document", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing document
        /// </summary>
        [HttpPut("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<DocumentResponse>> UpdateDocument(string id, [FromBody] UpdateDocumentRequest request)
        {
            try
            {
                var existingDocument = await _documentService.GetByIdAsync(id);
                if (existingDocument == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                // Update only provided fields
                if (request.Name != null) existingDocument.Name = request.Name;
                if (request.Price.HasValue) existingDocument.Price = request.Price.Value;
                if (request.ProcessingTime != null) existingDocument.ProcessingTime = request.ProcessingTime;
                if (request.Status != null) existingDocument.Status = request.Status;
                if (request.Requirements != null) existingDocument.Requirements = request.Requirements;
                if (request.TemplateUrl != null) existingDocument.TemplateUrl = request.TemplateUrl;

                var updatedDocument = await _documentService.UpdateAsync(id, existingDocument);
                if (updatedDocument == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                var response = new DocumentResponse
                {
                    Id = updatedDocument.Id ?? "",
                    Name = updatedDocument.Name,
                    Price = updatedDocument.Price,
                    Requirements = updatedDocument.Requirements,
                    Status = updatedDocument.Status,
                    ProcessingTime = updatedDocument.ProcessingTime,
                    TemplateUrl = updatedDocument.TemplateUrl,
                    TotalRequests = updatedDocument.TotalRequests,
                    LastModified = updatedDocument.LastModified,
                    CreatedAt = updatedDocument.CreatedAt,
                    UpdatedAt = updatedDocument.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating document", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a document
        /// </summary>
        [HttpDelete("{id}")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteDocument(string id)
        {
            try
            {
                var result = await _documentService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Document not found" });
                }

                return Ok(new { message = "Document deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting document", error = ex.Message });
            }
        }

        /// <summary>
        /// Toggle document status (Activate/Deactivate)
        /// </summary>
        [HttpPatch("{id}/status")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<DocumentResponse>> ToggleDocumentStatus(string id, [FromBody] ToggleDocumentStatusRequest request)
        {
            try
            {
                var document = await _documentService.ToggleStatusAsync(id, request.Status);
                if (document == null)
                {
                    return NotFound(new { message = "Document not found" });
                }

                var response = new DocumentResponse
                {
                    Id = document.Id ?? "",
                    Name = document.Name,
                    Price = document.Price,
                    Requirements = document.Requirements,
                    Status = document.Status,
                    ProcessingTime = document.ProcessingTime,
                    TemplateUrl = document.TemplateUrl,
                    TotalRequests = document.TotalRequests,
                    LastModified = document.LastModified,
                    CreatedAt = document.CreatedAt,
                    UpdatedAt = document.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while toggling document status", error = ex.Message });
            }
        }

        /// <summary>
        /// Duplicate a document
        /// </summary>
        [HttpPost("{id}/duplicate")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult<DocumentResponse>> DuplicateDocument(string id)
        {
            try
            {
                var duplicatedDocument = await _documentService.DuplicateAsync(id);

                var response = new DocumentResponse
                {
                    Id = duplicatedDocument.Id ?? "",
                    Name = duplicatedDocument.Name,
                    Price = duplicatedDocument.Price,
                    Requirements = duplicatedDocument.Requirements,
                    Status = duplicatedDocument.Status,
                    ProcessingTime = duplicatedDocument.ProcessingTime,
                    TemplateUrl = duplicatedDocument.TemplateUrl,
                    TotalRequests = duplicatedDocument.TotalRequests,
                    LastModified = duplicatedDocument.LastModified,
                    CreatedAt = duplicatedDocument.CreatedAt,
                    UpdatedAt = duplicatedDocument.UpdatedAt
                };

                return CreatedAtAction(nameof(GetDocumentById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while duplicating document", error = ex.Message });
            }
        }

        /// <summary>
        /// Get active documents only
        /// </summary>
        [HttpGet("active")]
        public async Task<ActionResult<List<DocumentResponse>>> GetActiveDocuments()
        {
            try
            {
                var documents = await _documentService.GetActiveDocumentsAsync();
                var response = documents.Select(doc => new DocumentResponse
                {
                    Id = doc.Id ?? "",
                    Name = doc.Name,
                    Price = doc.Price,
                    Requirements = doc.Requirements,
                    Status = doc.Status,
                    ProcessingTime = doc.ProcessingTime,
                    TemplateUrl = doc.TemplateUrl,
                    TotalRequests = doc.TotalRequests,
                    LastModified = doc.LastModified,
                    CreatedAt = doc.CreatedAt,
                    UpdatedAt = doc.UpdatedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching active documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Search documents by name
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<List<DocumentResponse>>> SearchDocuments([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    return BadRequest(new { message = "Search query is required" });
                }

                var documents = await _documentService.SearchByNameAsync(query);
                var response = documents.Select(doc => new DocumentResponse
                {
                    Id = doc.Id ?? "",
                    Name = doc.Name,
                    Price = doc.Price,
                    Requirements = doc.Requirements,
                    Status = doc.Status,
                    ProcessingTime = doc.ProcessingTime,
                    TemplateUrl = doc.TemplateUrl,
                    TotalRequests = doc.TotalRequests,
                    LastModified = doc.LastModified,
                    CreatedAt = doc.CreatedAt,
                    UpdatedAt = doc.UpdatedAt
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Recalculate statistics for all documents
        /// </summary>
        [HttpPost("recalculate-statistics")]
        // [Authorize(Roles = "admin")]
        public async Task<ActionResult> RecalculateStatistics()
        {
            try
            {
                var documentRequests = _context.GetCollection<DocumentRequest>("documentRequests");
                await _documentService.RecalculateAllTotalRequestsAsync(documentRequests);

                return Ok(new { message = "Statistics recalculated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while recalculating statistics", error = ex.Message });
            }
        }
    }
}
