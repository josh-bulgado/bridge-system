using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly DocumentTypeService _documentTypeService;

        public SeedController(DocumentTypeService documentTypeService)
        {
            _documentTypeService = documentTypeService;
        }

        // POST: api/Seed/document-types
        // Initialize default document types (only for development/first-time setup)
        [HttpPost("document-types")]
        public async Task<IActionResult> SeedDocumentTypes()
        {
            try
            {
                await _documentTypeService.InitializeDefaultTypesAsync();
                return Ok(new { message = "Document types seeded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to seed document types", error = ex.Message });
            }
        }
    }
}
