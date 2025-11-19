using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly FileStorageService _fileStorageService;

        public FileUploadController(FileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        // POST: api/FileUpload
        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            // Validate file size (5MB max)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File size exceeds 5MB limit" });

            // Validate file type
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and PDF files are allowed" });

            try
            {
                var fileId = await _fileStorageService.UploadFileAsync(file);
                
                return Ok(new
                {
                    fileId = fileId,
                    fileName = file.FileName,
                    fileSize = file.Length,
                    contentType = file.ContentType,
                    url = $"/FileUpload/{fileId}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to upload file", error = ex.Message });
            }
        }

        // GET: api/FileUpload/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFile(string id)
        {
            try
            {
                var (stream, contentType, fileName) = await _fileStorageService.DownloadFileAsync(id);
                
                if (stream == null)
                    return NotFound(new { message = "File not found" });

                return File(stream, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve file", error = ex.Message });
            }
        }

        // DELETE: api/FileUpload/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,staff")]
        public async Task<IActionResult> DeleteFile(string id)
        {
            try
            {
                await _fileStorageService.DeleteFileAsync(id);
                return Ok(new { message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete file", error = ex.Message });
            }
        }
    }
}
