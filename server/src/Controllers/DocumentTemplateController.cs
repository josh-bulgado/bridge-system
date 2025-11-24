using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using server.Services;
using Server.DTOs.DocumentTemplate;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DocumentTemplateController : ControllerBase
    {
        private readonly DocumentTemplateService _templateService;

        public DocumentTemplateController(DocumentTemplateService templateService)
        {
            _templateService = templateService;
        }

        // POST: api/DocumentTemplate
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateTemplate([FromBody] DocumentTemplateRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Get user ID from JWT token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var template = new DocumentTemplate
                {
                    DocumentType = request.DocumentType,
                    TemplateName = request.TemplateName,
                    TemplateUrl = request.TemplateUrl,
                };

                var createdTemplate = await _templateService.CreateTemplateAsync(template, userId);

                var response = MapToResponse(createdTemplate);

                return Ok(new
                {
                    message = "Template uploaded successfully",
                    data = response
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the template",
                    error = ex.Message
                });
            }
        }

        // GET: api/DocumentTemplate/active/{documentType}
        [HttpGet("active/{documentType}")]
        public async Task<IActionResult> GetActiveTemplate(string documentType)
        {
            try
            {
                var template = await _templateService.GetActiveTemplateAsync(documentType);

                if (template == null)
                {
                    return NotFound(new { message = "No active template found for this document type" });
                }

                var response = MapToResponse(template);
                return Ok(new { data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the template",
                    error = ex.Message
                });
            }
        }

        // GET: api/DocumentTemplate/history/{documentType}
        [HttpGet("history/{documentType}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTemplateHistory(string documentType)
        {
            try
            {
                var templates = await _templateService.GetTemplateHistoryAsync(documentType);

                var response = templates.Select(MapToResponse).ToList();

                return Ok(new { data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching template history",
                    error = ex.Message
                });
            }
        }

        // GET: api/DocumentTemplate/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplateById(string id)
        {
            try
            {
                var template = await _templateService.GetTemplateByIdAsync(id);

                if (template == null)
                {
                    return NotFound(new { message = "Template not found" });
                }

                var response = MapToResponse(template);
                return Ok(new { data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching the template",
                    error = ex.Message
                });
            }
        }

        // GET: api/DocumentTemplate/all/active
        [HttpGet("all/active")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllActiveTemplates()
        {
            try
            {
                var templates = await _templateService.GetAllActiveTemplatesAsync();
                var response = templates.Select(MapToResponse).ToList();

                return Ok(new { data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while fetching templates",
                    error = ex.Message
                });
            }
        }

        // Helper method to map model to response
        private static DocumentTemplateResponse MapToResponse(DocumentTemplate template)
        {
            return new DocumentTemplateResponse
            {
                Id = template.Id ?? string.Empty,
                DocumentType = template.DocumentType,
                TemplateName = template.TemplateName,
                TemplateUrl = template.TemplateUrl,
                IsActive = template.IsActive,
                Version = template.Version,
                CreatedAt = template.CreatedAt,
                CreatedBy = template.CreatedBy
            };
        }
    }
}
