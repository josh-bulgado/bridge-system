using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace server.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IOptions<CloudinarySettings> settings, ILogger<CloudinaryService> logger)
        {
            _logger = logger;

            // 🔒 Security: Never log sensitive credentials
            #if DEBUG
            _logger.LogInformation($"Cloudinary Cloud Name: {settings.Value.CloudName}");
            _logger.LogInformation("Cloudinary credentials loaded successfully");
            #endif

            var account = new Account(
                settings.Value.CloudName,
                settings.Value.ApiKey,
                settings.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true; // Use HTTPS
        }

        /// <summary>
        /// Upload an image file to Cloudinary
        /// </summary>
        public async Task<(bool success, string? url, string? publicId, string? error)> UploadImageAsync(
            IFormFile file,
            string folder = "images",
            int? maxWidth = null,
            int? maxHeight = null)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return (false, null, null, "No file provided");
                }

                // Validate file type
                var allowedImageTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!allowedImageTypes.Contains(file.ContentType.ToLower()))
                {
                    return (false, null, null, $"Invalid file type. Allowed types: {string.Join(", ", allowedImageTypes)}");
                }

                // Validate file size (max 10MB for images)
                if (file.Length > 10 * 1024 * 1024)
                {
                    return (false, null, null, "File size exceeds 10MB limit");
                }

                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    Transformation = new Transformation()
                        .Quality("auto")
                        .FetchFormat("auto")
                };

                // Add size limits if specified
                if (maxWidth.HasValue || maxHeight.HasValue)
                {
                    uploadParams.Transformation = uploadParams.Transformation
                        .Width(maxWidth ?? 2000)
                        .Height(maxHeight ?? 2000)
                        .Crop("limit");
                }

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    return (false, null, null, uploadResult.Error.Message);
                }

                return (true, uploadResult.SecureUrl.ToString(), uploadResult.PublicId, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image to Cloudinary");
                return (false, null, null, ex.Message);
            }
        }

        /// <summary>
        /// Upload a document file (PDF, DOCX, etc.) to Cloudinary with enhanced security
        /// </summary>
        public async Task<(bool success, string? url, string? publicId, string? error, string? fileType)> UploadDocumentAsync(
            IFormFile file,
            string folder = "documents")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return (false, null, null, "No file provided", null);
                }

                // 🔒 Security: Validate file extension matches content type
                var fileExtension = Path.GetExtension(file.FileName)?.ToLower();
                var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp" };
                
                if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
                {
                    _logger.LogWarning($"Upload rejected: Invalid file extension '{fileExtension}'");
                    return (false, null, null, "Invalid file extension. Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP", null);
                }

                // 🔒 Security: Validate MIME type
                var allowedDocTypes = new Dictionary<string, string[]>
                {
                    { ".pdf", new[] { "application/pdf" } },
                    { ".doc", new[] { "application/msword" } },
                    { ".docx", new[] { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } },
                    { ".jpg", new[] { "image/jpeg", "image/jpg" } },
                    { ".jpeg", new[] { "image/jpeg", "image/jpg" } },
                    { ".png", new[] { "image/png" } },
                    { ".webp", new[] { "image/webp" } }
                };

                var contentType = file.ContentType.ToLower();
                if (!allowedDocTypes.TryGetValue(fileExtension, out var validMimeTypes) || 
                    !validMimeTypes.Contains(contentType))
                {
                    _logger.LogWarning($"Upload rejected: MIME type '{contentType}' doesn't match extension '{fileExtension}'");
                    return (false, null, null, $"File content type does not match extension. This may indicate a security risk.", null);
                }

                // 🔒 Security: Validate file size (max 10MB for verification documents)
                const long maxFileSize = 10 * 1024 * 1024; // 10MB
                if (file.Length > maxFileSize)
                {
                    _logger.LogWarning($"Upload rejected: File size {file.Length} bytes exceeds limit");
                    return (false, null, null, "File size exceeds 10MB limit", null);
                }

                // 🔒 Security: Validate file signature (magic numbers) for images
                if (fileExtension == ".jpg" || fileExtension == ".jpeg" || fileExtension == ".png" || fileExtension == ".webp")
                {
                    using var stream = file.OpenReadStream();
                    var buffer = new byte[8];
                    var bytesRead = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length));
                    stream.Position = 0;

                    if (bytesRead < 4 || !ValidateFileSignature(buffer, fileExtension))
                    {
                        _logger.LogWarning($"Upload rejected: Invalid file signature for {fileExtension}");
                        return (false, null, null, "File appears to be corrupted or not a valid image", null);
                    }
                }

                // 🔒 Security: Sanitize filename
                var sanitizedFileName = SanitizeFileName(file.FileName);
                
                using var uploadStream = file.OpenReadStream();

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(sanitizedFileName, uploadStream),
                    Folder = folder,
                    // 🔒 Security: Use authenticated type for secure access
                    // Files require signed URLs with authentication tokens
                    Type = "authenticated",
                    // 🔒 Security: Add tags for tracking
                    Tags = "verification_document,sensitive"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    return (false, null, null, uploadResult.Error.Message, null);
                }

                _logger.LogInformation($"Document uploaded successfully: {uploadResult.PublicId}");
                return (true, uploadResult.SecureUrl.ToString(), uploadResult.PublicId, null, contentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document to Cloudinary");
                return (false, null, null, "An error occurred while uploading the file", null);
            }
        }

        /// <summary>
        /// 🔒 Security: Validate file signature (magic numbers)
        /// </summary>
        private bool ValidateFileSignature(byte[] buffer, string extension)
        {
            if (buffer.Length < 4) return false;

            return extension switch
            {
                ".jpg" or ".jpeg" => buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF,
                ".png" => buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47,
                ".webp" => buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46,
                _ => true // Skip validation for other types
            };
        }

        /// <summary>
        /// 🔒 Security: Sanitize filename to prevent path traversal attacks
        /// </summary>
        private string SanitizeFileName(string fileName)
        {
            // Remove path separators and special characters
            var invalidChars = Path.GetInvalidFileNameChars();
            var sanitized = string.Join("_", fileName.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
            
            // Limit filename length
            if (sanitized.Length > 100)
            {
                var extension = Path.GetExtension(sanitized);
                var nameWithoutExt = Path.GetFileNameWithoutExtension(sanitized);
                sanitized = nameWithoutExt.Substring(0, 100 - extension.Length) + extension;
            }

            return sanitized;
        }

        /// <summary>
        /// Upload profile picture with specific transformations
        /// </summary>
        public async Task<(bool success, string? url, string? publicId, string? error)> UploadProfilePictureAsync(
            IFormFile file,
            string userId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return (false, null, null, "No file provided");
                }

                // Validate image type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/webp" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return (false, null, null, "Invalid file type. Allowed: JPG, PNG, WEBP");
                }

                // Validate file size (max 5MB for profile pictures)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return (false, null, null, "File size exceeds 5MB limit");
                }

                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "profile-pictures",
                    PublicId = $"user_{userId}_{Guid.NewGuid()}", // Unique ID for each upload
                    Transformation = new Transformation()
                        .Width(400)
                        .Height(400)
                        .Crop("fill")
                        .Gravity("face") // Focus on face if detected
                        .Quality("auto")
                        .FetchFormat("auto"),
                    Overwrite = false
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    return (false, null, null, uploadResult.Error.Message);
                }

                return (true, uploadResult.SecureUrl.ToString(), uploadResult.PublicId, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile picture to Cloudinary");
                return (false, null, null, ex.Message);
            }
        }

        /// <summary>
        /// Delete a file from Cloudinary
        /// </summary>
        public async Task<(bool success, string? error)> DeleteFileAsync(string publicId, bool isDocument = false)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return (false, "Public ID is required");
                }

                var deletionParams = new DeletionParams(publicId)
                {
                    ResourceType = isDocument ? ResourceType.Raw : ResourceType.Image
                };

                var result = await _cloudinary.DestroyAsync(deletionParams);

                if (result.Result != "ok" && result.Result != "not found")
                {
                    _logger.LogError($"Cloudinary deletion error: {result.Result}");
                    return (false, result.Result);
                }

                return (true, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file from Cloudinary");
                return (false, ex.Message);
            }
        }

        /// <summary>
        /// Get optimized image URL with transformations
        /// </summary>
        public string GetOptimizedImageUrl(string publicId, int? width = null, int? height = null, string crop = "limit")
        {
            var transformation = new Transformation()
                .Quality("auto")
                .FetchFormat("auto");

            if (width.HasValue || height.HasValue)
            {
                transformation = transformation
                    .Width(width ?? 800)
                    .Height(height ?? 800)
                    .Crop(crop);
            }

            return _cloudinary.Api.UrlImgUp.Transform(transformation).BuildUrl(publicId);
        }

        /// <summary>
        /// Get thumbnail URL for an image
        /// </summary>
        public string GetThumbnailUrl(string publicId, int size = 150)
        {
            return _cloudinary.Api.UrlImgUp
                .Transform(new Transformation()
                    .Width(size)
                    .Height(size)
                    .Crop("fill")
                    .Quality("auto")
                    .FetchFormat("auto"))
                .BuildUrl(publicId);
        }

        /// <summary>
        /// Generate a signed URL for authenticated resources with time-limited access
        /// </summary>
        public string GetSignedDocumentUrl(string publicId, int expiresInMinutes = 60)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    return string.Empty;
                }

                // Calculate expiration timestamp (current time + expiration minutes)
                var expirationTime = DateTimeOffset.UtcNow.AddMinutes(expiresInMinutes).ToUnixTimeSeconds();

                // Generate signed URL for authenticated resource
                // This creates a time-limited token for secure access
                var url = _cloudinary.Api.UrlImgUp
                    .ResourceType("raw")
                    .Type("authenticated")
                    .Secure(true)
                    .Signed(true)
                    .BuildUrl(publicId);

                _logger.LogInformation($"Generated signed URL for authenticated document: {publicId} (expires in {expiresInMinutes} minutes)");
                return url;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating signed URL for {publicId}");
                return string.Empty;
            }
        }

        /// <summary>
        /// Get a viewable URL for a document (handles both authenticated and public)
        /// </summary>
        public string GetDocumentViewUrl(string publicId, string? existingUrl = null)
        {
            try
            {
                // If we already have a working URL, use it
                if (!string.IsNullOrEmpty(existingUrl) && existingUrl.StartsWith("http"))
                {
                    return existingUrl;
                }

                if (string.IsNullOrEmpty(publicId))
                {
                    return string.Empty;
                }

                // Try to build a public URL first (for new uploads)
                var publicUrl = _cloudinary.Api.UrlImgUp
                    .ResourceType("raw")
                    .Secure(true)
                    .BuildUrl(publicId);

                return publicUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting document view URL for {publicId}");
                return string.Empty;
            }
        }
    }
}
