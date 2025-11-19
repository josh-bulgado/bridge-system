using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentTypeController : ControllerBase
    {
        private readonly DocumentTypeService _documentTypeService;

        public DocumentTypeController(DocumentTypeService documentTypeService)
        {
            _documentTypeService = documentTypeService;
        }

        // GET: api/DocumentType
        [HttpGet]
        public async Task<IActionResult> GetAllDocumentTypes()
        {
            var documentTypes = await _documentTypeService.GetAllAsync();
            return Ok(documentTypes);
        }

        // GET: api/DocumentType/active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveDocumentTypes()
        {
            var documentTypes = await _documentTypeService.GetActiveAsync();
            return Ok(documentTypes);
        }

        // GET: api/DocumentType/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocumentTypeById(string id)
        {
            var documentType = await _documentTypeService.GetByIdAsync(id);
            if (documentType == null)
                return NotFound(new { message = "Document type not found" });

            return Ok(documentType);
        }

        // GET: api/DocumentType/code/{code}
        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetDocumentTypeByCode(string code)
        {
            var documentType = await _documentTypeService.GetByCodeAsync(code);
            if (documentType == null)
                return NotFound(new { message = "Document type not found" });

            return Ok(documentType);
        }

        // GET: api/DocumentType/category/{category}
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetDocumentTypesByCategory(string category)
        {
            var documentTypes = await _documentTypeService.GetByCategoryAsync(category);
            return Ok(documentTypes);
        }

        // POST: api/DocumentType
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateDocumentType([FromBody] DocumentType documentType)
        {
            // Check if code already exists
            var existing = await _documentTypeService.GetByCodeAsync(documentType.Code);
            if (existing != null)
                return BadRequest(new { message = "Document type with this code already exists" });

            var created = await _documentTypeService.CreateAsync(documentType);
            return CreatedAtAction(nameof(GetDocumentTypeById), new { id = created.Id }, created);
        }

        // PUT: api/DocumentType/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateDocumentType(string id, [FromBody] DocumentType documentType)
        {
            var existing = await _documentTypeService.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { message = "Document type not found" });

            documentType.Id = id;
            documentType.CreatedAt = existing.CreatedAt;
            
            var updated = await _documentTypeService.UpdateAsync(id, documentType);
            return Ok(updated);
        }

        // DELETE: api/DocumentType/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDocumentType(string id)
        {
            var existing = await _documentTypeService.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { message = "Document type not found" });

            await _documentTypeService.DeleteAsync(id);
            return Ok(new { message = "Document type deleted successfully" });
        }

        // PUT: api/DocumentType/{id}/deactivate
        [HttpPut("{id}/deactivate")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeactivateDocumentType(string id)
        {
            var updated = await _documentTypeService.DeactivateAsync(id);
            if (updated == null)
                return NotFound(new { message = "Document type not found" });

            return Ok(updated);
        }

        // PUT: api/DocumentType/{id}/activate
        [HttpPut("{id}/activate")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ActivateDocumentType(string id)
        {
            var updated = await _documentTypeService.ActivateAsync(id);
            if (updated == null)
                return NotFound(new { message = "Document type not found" });

            return Ok(updated);
        }

        // POST: api/DocumentType/initialize
        [HttpPost("initialize")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> InitializeDefaultTypes()
        {
            await _documentTypeService.InitializeDefaultTypesAsync();
            return Ok(new { message = "Default document types initialized successfully" });
        }
    }
}
