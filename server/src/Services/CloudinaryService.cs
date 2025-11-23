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

            _logger.LogInformation($"Cloudinary API Key: {settings.Value.ApiKey}");
            _logger.LogInformation($"Cloudinary API Secret: {settings.Value.ApiSecret}");

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
        /// Upload a document file (PDF, DOCX, etc.) to Cloudinary
        /// </summary>
        public async Task<(bool success, string? url, string? publicId, string? error)> UploadDocumentAsync(
            IFormFile file,
            string folder = "documents")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return (false, null, null, "No file provided");
                }

                // Validate document types
                var allowedDocTypes = new[]
                {
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/jpg",
                "image/png"
            };

                if (!allowedDocTypes.Contains(file.ContentType.ToLower()))
                {
                    return (false, null, null, $"Invalid document type. Allowed types: PDF, DOCX, DOC, JPG, PNG");
                }

                // Validate file size (max 20MB for documents)
                if (file.Length > 20 * 1024 * 1024)
                {
                    return (false, null, null, "File size exceeds 20MB limit");
                }

                using var stream = file.OpenReadStream();

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder
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
                _logger.LogError(ex, "Error uploading document to Cloudinary");
                return (false, null, null, ex.Message);
            }
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
    }
}
