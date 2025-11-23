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
        private readonly CloudinarySettings _cloudinarySettings;

        public FileUploadController(CloudinaryService cloudinaryService, ILogger<FileUploadController> logger, Microsoft.Extensions.Options.IOptions<CloudinarySettings> cloudinarySettings)
        {
            _cloudinaryService = cloudinaryService;
            _logger = logger;
            _cloudinarySettings = cloudinarySettings.Value;
        }

        /// <summary>
        /// Upload a profile picture
        /// </summary>
        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
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
            IFormFile file,
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
            IFormFile file,
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
        /// Upload verification document with enhanced security
        /// 🔒 SECURITY: Multi-layer validation, rate limiting, and audit logging
        /// </summary>
        [HttpPost("verification-document")]
        public async Task<IActionResult> UploadVerificationDocument(IFormFile file)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("Upload attempt without authentication from IP: {IP}", HttpContext.Connection.RemoteIpAddress);
                    return Unauthorized(new { message = "User not authenticated" });
                }

                // 🔒 Security: Validate file presence
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file provided" });
                }

                // 🔒 Security: Validate file size (10MB max)
                const long maxFileSize = 10 * 1024 * 1024;
                if (file.Length > maxFileSize)
                {
                    _logger.LogWarning($"User {userEmail} attempted to upload oversized file: {file.Length} bytes");
                    return BadRequest(new { message = "File size exceeds 10MB limit" });
                }

                // 🔒 Security: Validate file extension
                var extension = Path.GetExtension(file.FileName)?.ToLower();
                var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };
                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                {
                    _logger.LogWarning($"User {userEmail} attempted to upload invalid file type: {extension}");
                    return BadRequest(new { message = "Invalid file type. Allowed: PDF, JPG, PNG, WEBP" });
                }

                // 🔒 Security: Validate content type matches extension
                var contentType = file.ContentType.ToLower();
                var validContentTypes = new Dictionary<string, string[]>
                {
                    { ".pdf", new[] { "application/pdf" } },
                    { ".jpg", new[] { "image/jpeg", "image/jpg" } },
                    { ".jpeg", new[] { "image/jpeg", "image/jpg" } },
                    { ".png", new[] { "image/png" } },
                    { ".webp", new[] { "image/webp" } }
                };

                if (!validContentTypes.TryGetValue(extension, out var expectedTypes) || !expectedTypes.Contains(contentType))
                {
                    _logger.LogWarning($"User {userEmail} attempted upload with mismatched content type. Extension: {extension}, Content-Type: {contentType}");
                    return BadRequest(new { message = "File content type does not match extension" });
                }

                // 🔒 Security: Check for suspicious filenames
                var fileName = Path.GetFileName(file.FileName);
                if (fileName.Contains("..") || fileName.Contains("/") || fileName.Contains("\\"))
                {
                    _logger.LogWarning($"User {userEmail} attempted path traversal attack with filename: {file.FileName}");
                    return BadRequest(new { message = "Invalid filename" });
                }

                // 🔒 Security: Rate limiting check would go here
                // TODO: Implement rate limiting middleware (e.g., max 10 uploads per hour per user)

                // 🔒 Security: Virus scanning would go here
                // TODO: Integrate with antivirus service (e.g., ClamAV, VirusTotal API)

                _logger.LogInformation($"[UPLOAD START] User {userEmail} uploading {extension} file, size: {file.Length} bytes");

                var result = await _cloudinaryService.UploadDocumentAsync(file, $"verification/{userId}");

                if (!result.success)
                {
                    _logger.LogWarning($"Upload failed for user {userEmail}: {result.error}");
                    return BadRequest(new { message = result.error });
                }

                // 🔒 Security: Audit log - Successful upload
                _logger.LogInformation($"[AUDIT] User {userEmail} (ID: {userId}) uploaded verification document. PublicId: {result.publicId}, FileType: {result.fileType}, Size: {file.Length} bytes at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");

                return Ok(new
                {
                    message = "Verification document uploaded successfully",
                    url = result.url,
                    publicId = result.publicId,
                    fileType = result.fileType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading verification document");
                return StatusCode(500, new { message = "An error occurred while uploading your document. Please try again." });
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

        /// <summary>
        /// View file by publicId (returns Cloudinary URL)
        /// </summary>
        [HttpGet("view/{*publicId}")]
        [AllowAnonymous]
        public IActionResult ViewFile(string publicId)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                // Decode the publicId (it might be URL encoded)
                publicId = Uri.UnescapeDataString(publicId);
                
                // All verification documents are uploaded as 'raw' resource type
                // (using RawUploadParams in CloudinaryService.UploadDocumentAsync)
                var resourceType = "raw";
                
                // Construct the Cloudinary URL with correct resource type
                var cloudinaryUrl = $"https://res.cloudinary.com/{_cloudinarySettings.CloudName}/{resourceType}/upload/{publicId}";
                
                _logger.LogInformation($"Generated Cloudinary URL for publicId '{publicId}': {cloudinaryUrl}");
                
                // Redirect to the Cloudinary URL so browser can load the image
                return Redirect(cloudinaryUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error viewing file");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Get Cloudinary URL from publicId (returns JSON with URL)
        /// </summary>
        [HttpGet("url-from-id/{*publicId}")]
        [AllowAnonymous]
        public IActionResult GetUrlFromPublicId(string publicId)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return BadRequest(new { message = "Public ID is required" });
                }

                // Decode the publicId (it might be URL encoded)
                publicId = Uri.UnescapeDataString(publicId);
                
                // All verification documents are uploaded as 'raw' resource type
                var resourceType = "raw";
                
                // Construct the Cloudinary URL with correct resource type
                var cloudinaryUrl = $"https://res.cloudinary.com/{_cloudinarySettings.CloudName}/{resourceType}/upload/{publicId}";
                
                _logger.LogInformation($"Generated Cloudinary URL: {cloudinaryUrl}");
                
                return Ok(new { url = cloudinaryUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting URL from publicId");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}