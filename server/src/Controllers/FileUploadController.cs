using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(CloudinaryService cloudinaryService, ILogger<FileUploadController> logger)
        {
            _cloudinaryService = cloudinaryService;
            _logger = logger;
        }

        /// <summary>
        /// Upload a profile picture
        /// </summary>
        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var result = await _cloudinaryService.UploadProfilePictureAsync(file, userId);

                if (!result.success)
                {
                    return BadRequest(new { message = result.error });
                }

                return Ok(new
                {
                    message = "Profile picture uploaded successfully",
                    url = result.url,
                    publicId = result.publicId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile picture");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Upload an image
        /// </summary>
        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(
            [FromForm] IFormFile file,
            [FromForm] string? folder = "images",
            [FromForm] int? maxWidth = null,
            [FromForm] int? maxHeight = null)
        {
            try
            {
                var result = await _cloudinaryService.UploadImageAsync(file, folder ?? "images", maxWidth, maxHeight);

                if (!result.success)
                {
                    return BadRequest(new { message = result.error });
                }

                return Ok(new
                {
                    message = "Image uploaded successfully",
                    url = result.url,
                    publicId = result.publicId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Upload a document (PDF, DOCX, images)
        /// </summary>
        [HttpPost("document")]
        public async Task<IActionResult> UploadDocument(
            [FromForm] IFormFile file,
            [FromForm] string? folder = "documents")
        {
            try
            {
                var result = await _cloudinaryService.UploadDocumentAsync(file, folder ?? "documents");

                if (!result.success)
                {
                    return BadRequest(new { message = result.error });
                }

                return Ok(new
                {
                    message = "Document uploaded successfully",
                    url = result.url,
                    publicId = result.publicId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Upload verification document
        /// </summary>
        [HttpPost("verification-document")]
        public async Task<IActionResult> UploadVerificationDocument([FromForm] IFormFile file)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated" });
                }

                var result = await _cloudinaryService.UploadDocumentAsync(file, $"verification/{userId}");

                if (!result.success)
                {
                    return BadRequest(new { message = result.error });
                }

                return Ok(new
                {
                    message = "Verification document uploaded successfully",
                    url = result.url,
                    publicId = result.publicId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading verification document");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete a file from Cloudinary
        /// </summary>
        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromQuery] string publicId, [FromQuery] bool isDocument = false)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                // Decode the publicId (it may be URL encoded)
                publicId = Uri.UnescapeDataString(publicId);

                var result = await _cloudinaryService.DeleteFileAsync(publicId, isDocument);

                if (!result.success)
                {
                    return BadRequest(new { message = result.error });
                }

                return Ok(new { message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get optimized image URL
        /// </summary>
        [HttpGet("optimize-url")]
        [AllowAnonymous]
        public IActionResult GetOptimizedUrl(
            [FromQuery] string publicId,
            [FromQuery] int? width = null,
            [FromQuery] int? height = null,
            [FromQuery] string crop = "limit")
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                var url = _cloudinaryService.GetOptimizedImageUrl(publicId, width, height, crop);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating optimized URL");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get thumbnail URL
        /// </summary>
        [HttpGet("thumbnail-url")]
        [AllowAnonymous]
        public IActionResult GetThumbnailUrl([FromQuery] string publicId, [FromQuery] int size = 150)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                var url = _cloudinaryService.GetThumbnailUrl(publicId, size);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating thumbnail URL");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
